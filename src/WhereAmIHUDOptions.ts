// Core
export let whereAmIHUD = new TextModule(
    "whereAmIHUD",
    "GXU: WhereAmIHUD",
    "Automatically runs /whereami on every server join, and shows selected details as a module",
    KeyCode.None,
);

// Order: ServerName, Region, Privacy, ParkourUUID, Username, [ServerUUID, PodName, CommitID, ShulkerID]

// Server Name
export let optionServerName = whereAmIHUD.addBoolSetting(
    "ServerName",
    "Server Name",
    "Shows the ServerName (game/lobby name) field",
    true
);
export let optionFormatServerName = whereAmIHUD.addBoolSetting(
    "FormatServerName",
    "Format Server Name",
    "Makes the server name field use proper formatting",
    true
);
optionFormatServerName.setCondition("ServerName");
export let optionServerNamePrefix = whereAmIHUD.addTextSetting(
    "ServerNamePrefix",
    "Prefix (Server Name)",
    "Text to display before the server name entry",
    ""
);
optionServerNamePrefix.setCondition("ServerName");
export let optionServerNameSuffix = whereAmIHUD.addTextSetting(
    "ServerNameSuffix",
    "Suffix (Server Name)",
    "Text to display after the server name entry",
    ""
);
optionServerNameSuffix.setCondition("ServerName");

// Region
export let optionRegion = whereAmIHUD.addBoolSetting(
    "Region",
    "Region",
    "Shows the Region field",
    true
);
export let optionUseNAName = whereAmIHUD.addBoolSetting(
    "UseNA",
    "Change US Region To NA",
    "Changes the US region label to NA (to be more consistent with the rest of the server)",
    true
);
optionUseNAName.setCondition("Region");
export let optionRegionPrefix = whereAmIHUD.addTextSetting(
    "RegionPrefix",
    "Prefix (Region)",
    "Text to display before the region entry",
    "Region: "
);
optionRegionPrefix.setCondition("Region");
export let optionRegionSuffix = whereAmIHUD.addTextSetting(
    "RegionSuffix",
    "Suffix (Region)",
    "Text to display after the region entry",
    ""
);
optionRegionSuffix.setCondition("Region");

// Privacy
export let optionPrivacy = whereAmIHUD.addBoolSetting(
    "Privacy",
    "Privacy",
    "Shows the Privacy (public/private game) field",
    true
);
export let optionPrivacyPrefix = whereAmIHUD.addTextSetting(
    "PrivacyPrefix",
    "Prefix (Privacy)",
    "Text to display before the Privacy entry",
    ""
);
optionPrivacyPrefix.setCondition("Privacy")
export let optionPrivacySuffix = whereAmIHUD.addTextSetting(
    "PrivacySuffix",
    "Suffix (Privacy)",
    "Text to display after the Privacy entry",
    " Game"
);
optionPrivacySuffix.setCondition("Privacy");

// Parkour UUID
export let optionParkourUUID = whereAmIHUD.addBoolSetting(
    "ParkourUUID",
    "Parkour UUID",
    "Shows the Parkour UUID field (if in parkour)",
    true
);
export let optionParkourUUIDPrefix = whereAmIHUD.addTextSetting(
    "ParkourUUIDPrefix",
    "Prefix (Parkour UUID)",
    "Text to display before the Parkour UUID entry",
    "ParkourUUID: "
);
optionParkourUUIDPrefix.setCondition("ParkourUUID");
export let optionParkourUUIDSuffix = whereAmIHUD.addTextSetting(
    "ParkourUUIDSuffix",
    "Suffix (Parkour UUID)",
    "Text to display after the Parkour UUID entry",
    ""
);
optionParkourUUIDSuffix.setCondition("ParkourUUID");

// Username
export let optionUsername = whereAmIHUD.addBoolSetting(
    "Username",
    "Username",
    "Shows the Username field",
    true
);
export let optionUsernamePrefix = whereAmIHUD.addTextSetting(
    "UsernamePrefix",
    "Prefix (Username)",
    "Text to display before the Username entry",
    "Username: "
);
optionUsernamePrefix.setCondition("Username");
export let optionUsernameSuffix = whereAmIHUD.addTextSetting(
    "UsernameSuffix",
    "Suffix (Username)",
    "Text to display after the Username field",
    ""
);
optionUsernameSuffix.setCondition("Username");

// Dev Fields
export let optionDevFields = whereAmIHUD.addBoolSetting(
    "DevFields",
    "Developer Fields",
    "Shows details less important to normal users (ServerUUID, PodName, CommitID, and ShulkerID)",
    false
);

// Server UUID
export let optionServerUUIDPrefix = whereAmIHUD.addTextSetting(
    "ServerUUIDPrefix",
    "Prefix (Server UUID)",
    "Text to display before the Server UUID entry",
    "Server UUID: "
);
optionServerUUIDPrefix.setCondition("DevFields");
export let optionServerUUIDSuffix = whereAmIHUD.addTextSetting(
    "ServerUUIDSuffix",
    "Suffix (Server UUID)",
    "Text to display after the Suffix entry",
    ""
);
optionServerUUIDSuffix.setCondition("DevFields");

// Pod Name
export let optionPodNamePrefix = whereAmIHUD.addTextSetting(
    "PodNamePrefix",
    "Prefix (Pod Name)",
    "Text to display before the Pod Name entry",
    "Pod Name: "
);
optionPodNamePrefix.setCondition("DevFields");
export let optionPodNameSuffix = whereAmIHUD.addTextSetting(
    "PodNameSuffix",
    "Suffix (Pod Name)",
    "Text to display after the Pod Name entry",
    ""
);
optionPodNameSuffix.setCondition("DevFields");

// Commit ID
export let optionCommitIDPrefix = whereAmIHUD.addTextSetting(
    "CommitIDPrefix",
    "Prefix (Commit ID)",
    "Text to display before the Commit ID entry",
    "CommitID: "
);
optionCommitIDPrefix.setCondition("DevFields");
export let optionCommitIDSuffix = whereAmIHUD.addTextSetting(
    "CommitIDSuffix",
    "Suffix (Commit ID)",
    "Text to display after the Commit ID entry",
    ""
);
optionCommitIDSuffix.setCondition("DevFields");

// Shulker ID
export let optionShulkerIDPrefix = whereAmIHUD.addTextSetting(
    "ShulkerIDPrefix",
    "Prefix (Shulker ID)",
    "Text to display before the Shulker ID entry",
    "ShulkerID: "
);
optionShulkerIDPrefix.setCondition("DevFields");
export let optionShulkerIDSuffix = whereAmIHUD.addTextSetting(
    "ShulkerIDSuffix",
    "Suffix (Shulker ID)",
    "Text to display after the Shulker ID entry",
    ""
);
optionShulkerIDSuffix.setCondition("DevFields");

client.getModuleManager().registerModule(whereAmIHUD); // Putting this after settings makes the custom settings appear first