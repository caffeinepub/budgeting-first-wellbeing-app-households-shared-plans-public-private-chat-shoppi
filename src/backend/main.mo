import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  type DateOfBirth = {
    year : Nat;
    month : Nat;
    day : Nat;
  };

  public type PublicProfile = {
    username : Text;
    avatar : ?Storage.ExternalBlob;
  };

  public type PrivateProfile = {
    fullName : Text;
    dob : DateOfBirth;
    avatar : ?Storage.ExternalBlob;
    isAdult : Bool;
    createdAt : Time.Time;
    lastUpdated : Time.Time;
  };

  public type FullProfile = {
    publicProfile : PublicProfile;
    privateDetails : ?PrivateProfile;
  };

  public type Budget = {
    netIncome : Float;
    expenses : Float;
    goals : Text;
  };

  public type HouseholdInvite = {
    inviter : Principal;
    inviterUsername : Text;
    invitee : Principal;
    inviteeUsername : Text;
    status : { #pending; #accepted; #declined };
    createdAt : Time.Time;
  };

  public type Household = {
    id : Text;
    members : [Principal];
    householdBudget : Budget;
    individualBudgets : Map.Map<Principal, Budget>;
    createdAt : Time.Time;
  };

  // New modules types
  public type RenewalReminder = {
    id : Text;
    user : Principal;
    title : Text;
    description : Text;
    dueDate : Time.Time;
    recurrence : { #none; #monthly; #yearly };
    createdAt : Time.Time;
    updatedAt : Time.Time;
    cost : ?Float;
    notes : Text;
    isActive : Bool;
  };

  public type SavingsCoachInput = {
    recurringBills : [(Text, Float)];
    memberships : [(Text, Float)];
    budget : Budget;
    goals : Text;
    income : Float;
    expenses : Float;
  };

  public type SavingsRecommendation = {
    category : Text;
    recommendation : Text;
    explanation : Text;
    savingsAmount : Float;
    mustHave : Bool;
    potentialImpact : { #high; #medium; #low };
  };

  public type MembershipCheckerInput = {
    name : Text;
    monthlyCost : Float;
    usageCount : Nat;
    premiumFeatures : Text;
  };

  public type MembershipCheckerResult = {
    name : Text;
    savings : Float;
    recommendations : Text;
    mustHave : Bool;
    last3monthsUsage : Bool;
    notes : Text;
  };

  public type WellbeingGoal = {
    id : Text;
    user : Principal;
    description : Text;
    targetValue : Float;
    currentValue : Float;
    remainingValue : Float;
    targetDate : Time.Time;
    goalType : { #health; #fitness; #other };
    status : { #active; #completed; #archived };
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type FitnessActivity = {
    id : Text;
    name : Text;
    activityType : { #cardio; #strength; #wellbeing };
    durationMinutes : Float;
    distanceKm : Float;
    completedAt : Time.Time;
    user : Principal;
    participants : [Principal];
    caloriesBurned : Float;
    isShared : Bool;
    notes : Text;
    createdAt : Time.Time;
    groupId : ?Text;
  };

  public type MealPlan = {
    id : Text;
    user : Principal;
    name : Text;
    meals : [(Text, Text)];
    createdAt : Time.Time;
    updatedAt : Time.Time;
    sharedWith : [Principal];
  };

  public type ShoppingList = {
    id : Text;
    user : Principal;
    name : Text;
    items : [(Text, Bool)];
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type Achievement = {
    id : Text;
    user : Principal;
    achievementType : Text;
    unlockedAt : Time.Time;
    description : Text;
  };

  public type ChatMessage = {
    id : Text;
    sender : Principal;
    senderUsername : Text;
    content : Text;
    timestamp : Time.Time;
    image : ?Storage.ExternalBlob;
    isGlobal : Bool;
    recipient : ?Principal;
  };

  public type UserBlock = {
    blocker : Principal;
    blocked : Principal;
    timestamp : Time.Time;
  };

  // Data storage maps
  let personalBudgets = Map.empty<Principal, Budget>();
  let publicProfiles = Map.empty<Text, PublicProfile>();
  let privateProfiles = Map.empty<Principal, PrivateProfile>();
  let principalToUsername = Map.empty<Principal, Text>();
  let usernameToPrincipal = Map.empty<Text, Principal>();
  let allHouseholds = Map.empty<Text, Household>();
  let userToHousehold = Map.empty<Principal, Text>();
  let householdInvites = Map.empty<Text, HouseholdInvite>();
  let userPendingInvites = Map.empty<Principal, [Text]>();
  var inviteCounter : Nat = 0;

  // Storage for new use cases
  let renewalReminders = Map.empty<Principal, List.List<RenewalReminder>>();
  let wellbeingGoals = Map.empty<Principal, List.List<WellbeingGoal>>();
  let sharedActivities = Map.empty<Principal, List.List<FitnessActivity>>();
  let mealPlans = Map.empty<Principal, List.List<MealPlan>>();
  let shoppingLists = Map.empty<Principal, List.List<ShoppingList>>();
  let achievements = Map.empty<Principal, List.List<Achievement>>();
  let globalChatMessages = List.empty<ChatMessage>();
  let privateMessages = Map.empty<Principal, List.List<ChatMessage>>();
  let userBlocks = Map.empty<Principal, List.List<UserBlock>>();

  module Profile {
    public func compareProfile(profile1 : (Text, PublicProfile), profile2 : (Text, PublicProfile)) : Order.Order {
      Text.compare(profile1.1.username, profile2.1.username);
    };
  };

  // Helper function to calculate age (currently fixed year for simplicity)
  func calculateAge(dob : DateOfBirth) : Nat {
    let currentYear = 2024; // Fixed year for simplicity
    if (dob.year <= currentYear) {
      currentYear - dob.year;
    } else {
      0;
    };
  };

  // Helper function to check if user is 18+
  func isAdult(dob : DateOfBirth) : Bool {
    calculateAge(dob) >= 18;
  };

  // Helper function to get username by principal
  func getUsernameByPrincipal(caller : Principal) : Text {
    switch (principalToUsername.get(caller)) {
      case (?username) { username };
      case (null) { Runtime.trap("Profile not found for this user") };
    };
  };

  // Helper function to check household membership
  func isHouseholdMember(caller : Principal, householdId : Text) : Bool {
    switch (allHouseholds.get(householdId)) {
      case (?household) {
        let memberExists = household.members.foldLeft(
          false,
          func(acc, member) { acc or (member == caller) },
        );
        memberExists;
      };
      case (null) { false };
    };
  };

  // Helper function to check if user is blocked
  func isBlocked(caller : Principal, target : Principal) : Bool {
    switch (userBlocks.get(target)) {
      case (?blocks) {
        blocks.any(func(block) { block.blocked == caller });
      };
      case (null) { false };
    };
  };

  // Profile management
  public shared ({ caller }) func createProfile(username : Text, fullName : Text, dob : DateOfBirth) : async PublicProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    // Check if profile already exists
    switch (principalToUsername.get(caller)) {
      case (?_) { Runtime.trap("Profile already exists for this user") };
      case (null) {};
    };

    // Check if username is already taken
    switch (usernameToPrincipal.get(username)) {
      case (?_) { Runtime.trap("Username already taken") };
      case (null) {};
    };

    // Enforce 18+ requirement
    if (not isAdult(dob)) {
      Runtime.trap("Access restricted: You must be 18 years or older to use this application");
    };

    let now = Time.now();
    let publicProfile = {
      username;
      avatar = null;
    };

    let privateProfile = {
      fullName;
      dob;
      avatar = null;
      isAdult = true;
      createdAt = now;
      lastUpdated = now;
    };

    publicProfiles.add(username, publicProfile);
    privateProfiles.add(caller, privateProfile);
    principalToUsername.add(caller, username);
    usernameToPrincipal.add(username, caller);

    publicProfile;
  };

  public shared ({ caller }) func uploadProfilePicture(blob : Storage.ExternalBlob) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upload profile pictures");
    };

    // Update private profile
    switch (privateProfiles.get(caller)) {
      case (?profile) {
        let now = Time.now();
        let updatedPrivate = {
          profile with
          avatar = ?blob;
          lastUpdated = now;
        };
        privateProfiles.add(caller, updatedPrivate);
      };
      case (null) { Runtime.trap("Profile not found") };
    };

    // Update public profile
    let username = getUsernameByPrincipal(caller);
    switch (publicProfiles.get(username)) {
      case (?profile) {
        let updatedPublic = {
          profile with avatar = ?blob;
        };
        publicProfiles.add(username, updatedPublic);
      };
      case (null) { Runtime.trap("Public profile not found") };
    };
  };

  public query ({ caller }) func getPublicProfile(username : Text) : async PublicProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };

    switch (publicProfiles.get(username)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Profile not found") };
    };
  };

  public query ({ caller }) func getAllPublicProfiles() : async [PublicProfile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };

    publicProfiles.values().toArray();
  };

  public query ({ caller }) func getCallerUserProfile() : async FullProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };

    let username = getUsernameByPrincipal(caller);
    let publicProfile = switch (publicProfiles.get(username)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Profile not found") };
    };

    let privateProfile = privateProfiles.get(caller);

    {
      publicProfile;
      privateDetails = privateProfile;
    };
  };

  public query ({ caller }) func getUserProfile(userPrincipal : Principal) : async FullProfile {
    // Users can only view their own full profile, admins can view any
    if (caller != userPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own full profile");
    };

    let username = getUsernameByPrincipal(userPrincipal);
    let publicProfile = switch (publicProfiles.get(username)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Profile not found") };
    };

    let privateProfile = privateProfiles.get(userPrincipal);

    {
      publicProfile;
      privateDetails = privateProfile;
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(fullName : Text, dob : DateOfBirth) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    // Verify age requirement
    if (not isAdult(dob)) {
      Runtime.trap("Access restricted: You must be 18 years or older to use this application");
    };

    switch (privateProfiles.get(caller)) {
      case (?profile) {
        let now = Time.now();
        let updatedProfile = {
          profile with
          fullName = fullName;
          dob = dob;
          isAdult = true;
          lastUpdated = now;
        };
        privateProfiles.add(caller, updatedProfile);
      };
      case (null) { Runtime.trap("Profile not found") };
    };
  };

  // Admin-only: View private profile details (staff view)
  public query ({ caller }) func getPrivateProfileAsStaff(userPrincipal : Principal) : async ?PrivateProfile {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only staff can view private profile details");
    };

    privateProfiles.get(userPrincipal);
  };

  // Admin-only: Get all users with private details
  public query ({ caller }) func getAllUsersAsStaff() : async [(Text, PublicProfile, ?PrivateProfile)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only staff can view all user details");
    };

    let result = publicProfiles.toArray().map(
      func((username, publicProfile)) {
        let principal = switch (usernameToPrincipal.get(username)) {
          case (?p) { p };
          case (null) { Principal.fromText("aaaaa-aa") }; // Should not happen
        };
        let privateProfile = privateProfiles.get(principal);
        (username, publicProfile, privateProfile);
      }
    );
    result;
  };

  public query ({ caller }) func getAllProfilesByUsername() : async [(Text, PublicProfile)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };

    publicProfiles.toArray().sort(Profile.compareProfile);
  };

  public query ({ caller }) func allUsernames() : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view usernames");
    };

    publicProfiles.keys().toArray();
  };

  public query ({ caller }) func getAvatar(username : Text) : async ?Storage.ExternalBlob {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view avatars");
    };

    switch (publicProfiles.get(username)) {
      case (?profile) { profile.avatar };
      case (null) { Runtime.trap("Username not found") };
    };
  };

  // Personal Budget management
  public shared ({ caller }) func savePersonalBudget(budget : Budget) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save budgets");
    };

    personalBudgets.add(caller, budget);
  };

  public query ({ caller }) func getPersonalBudget() : async ?Budget {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get budgets");
    };

    personalBudgets.get(caller);
  };

  public query ({ caller }) func getBudgetByUsername(username : Text) : async ?Budget {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get budgets");
    };

    // Get the principal for the username
    let targetPrincipal = switch (usernameToPrincipal.get(username)) {
      case (?p) { p };
      case (null) { Runtime.trap("User not found") };
    };

    // Only allow viewing own budget or household member budgets
    if (caller != targetPrincipal) {
      // Check if they're in the same household
      let callerHousehold = userToHousehold.get(caller);
      let targetHousehold = userToHousehold.get(targetPrincipal);

      switch (callerHousehold, targetHousehold) {
        case (?ch, ?th) {
          if (ch != th) {
            Runtime.trap("Unauthorized: Can only view budgets of household members");
          };
        };
        case (_, _) {
          Runtime.trap("Unauthorized: Can only view your own budget");
        };
      };
    };

    personalBudgets.get(targetPrincipal);
  };

  // Household Invite System
  public shared ({ caller }) func inviteToHousehold(inviteeUsername : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send invites");
    };

    let inviterUsername = getUsernameByPrincipal(caller);

    // Get invitee principal
    let inviteePrincipal = switch (usernameToPrincipal.get(inviteeUsername)) {
      case (?p) { p };
      case (null) { Runtime.trap("Invitee user not found") };
    };

    // Cannot invite yourself
    if (caller == inviteePrincipal) {
      Runtime.trap("Cannot invite yourself to a household");
    };

    // Check if either user is already in a household
    switch (userToHousehold.get(caller)) {
      case (?_) { Runtime.trap("You are already in a household") };
      case (null) {};
    };

    switch (userToHousehold.get(inviteePrincipal)) {
      case (?_) { Runtime.trap("Invitee is already in a household") };
      case (null) {};
    };

    let inviteId = "invite_" # inviteCounter.toText();
    inviteCounter += 1;

    let invite : HouseholdInvite = {
      inviter = caller;
      inviterUsername = inviterUsername;
      invitee = inviteePrincipal;
      inviteeUsername = inviteeUsername;
      status = #pending;
      createdAt = Time.now();
    };

    householdInvites.add(inviteId, invite);

    // Add to invitee's pending invites
    let currentInvites = switch (userPendingInvites.get(inviteePrincipal)) {
      case (?invites) { invites };
      case (null) { [] };
    };
    let updatedInvites = currentInvites.concat([inviteId]);
    userPendingInvites.add(inviteePrincipal, updatedInvites);

    inviteId;
  };

  public query ({ caller }) func getPendingInvites() : async [(Text, HouseholdInvite)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view invites");
    };

    let inviteIds = switch (userPendingInvites.get(caller)) {
      case (?ids) { ids };
      case (null) { [] };
    };

    var validInvites : [(Text, HouseholdInvite)] = [];
    for (id in inviteIds.values()) {
      switch (householdInvites.get(id)) {
        case (?invite) {
          if (invite.status == #pending) {
            validInvites := validInvites.concat([(id, invite)]);
          };
        };
        case (null) {};
      };
    };
    validInvites;
  };

  public shared ({ caller }) func acceptHouseholdInvite(inviteId : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can accept invites");
    };

    let invite = switch (householdInvites.get(inviteId)) {
      case (?inv) { inv };
      case (null) { Runtime.trap("Invite not found") };
    };

    // Verify caller is the invitee
    if (invite.invitee != caller) {
      Runtime.trap("Unauthorized: This invite is not for you");
    };

    // Verify invite is still pending
    if (invite.status != #pending) {
      Runtime.trap("Invite is no longer pending");
    };

    // Check if either user is now in a household
    switch (userToHousehold.get(caller)) {
      case (?_) { Runtime.trap("You are already in a household") };
      case (null) {};
    };

    switch (userToHousehold.get(invite.inviter)) {
      case (?_) { Runtime.trap("Inviter is already in a household") };
      case (null) {};
    };

    // Create household
    let householdId = "household_" # inviteId;
    let now = Time.now();

    let emptyBudget : Budget = {
      netIncome = 0.0;
      expenses = 0.0;
      goals = "";
    };

    let individualBudgets = Map.empty<Principal, Budget>();

    // Copy personal budgets to household
    switch (personalBudgets.get(invite.inviter)) {
      case (?budget) { individualBudgets.add(invite.inviter, budget) };
      case (null) { individualBudgets.add(invite.inviter, emptyBudget) };
    };

    switch (personalBudgets.get(caller)) {
      case (?budget) { individualBudgets.add(caller, budget) };
      case (null) { individualBudgets.add(caller, emptyBudget) };
    };

    let household : Household = {
      id = householdId;
      members = [invite.inviter, caller];
      householdBudget = emptyBudget;
      individualBudgets = individualBudgets;
      createdAt = now;
    };

    allHouseholds.add(householdId, household);
    userToHousehold.add(invite.inviter, householdId);
    userToHousehold.add(caller, householdId);

    // Update invite status
    let updatedInvite = { invite with status = #accepted };
    householdInvites.add(inviteId, updatedInvite);

    // Remove accepted invite from pending list
    let currentInvites = switch (userPendingInvites.get(caller)) {
      case (?invites) { invites };
      case (null) { [] };
    };
    let filteredInvites = currentInvites.filter(func(id : Text) : Bool { id != inviteId });
    userPendingInvites.add(caller, filteredInvites);

    householdId;
  };

  public shared ({ caller }) func declineHouseholdInvite(inviteId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can decline invites");
    };

    let invite = switch (householdInvites.get(inviteId)) {
      case (?inv) { inv };
      case (null) { Runtime.trap("Invite not found") };
    };

    // Verify caller is the invitee
    if (invite.invitee != caller) {
      Runtime.trap("Unauthorized: This invite is not for you");
    };

    // Verify invite is still pending
    if (invite.status != #pending) {
      Runtime.trap("Invite is no longer pending");
    };

    // Update invite status
    let updatedInvite = { invite with status = #declined };
    householdInvites.add(inviteId, updatedInvite);

    // Remove from pending invites
    let currentInvites = switch (userPendingInvites.get(caller)) {
      case (?invites) { invites };
      case (null) { [] };
    };
    let filteredInvites = currentInvites.filter(func(id : Text) : Bool { id != inviteId });
    userPendingInvites.add(caller, filteredInvites);
  };
};
