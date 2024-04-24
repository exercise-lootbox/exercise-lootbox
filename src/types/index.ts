export interface LootboxInfo {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export interface ItemInfo {
  _id: string;
  lootboxId: string;
  name: string;
  description: string;
  image: string;
  rarity: Rarity;
}

enum Rarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

// Options for 'sport_type' attribute dropdown
export const sportTypes = [
  "AlpineSki",
  "BackcountrySki",
  "Badminton",
  "Canoeing",
  "Crossfit",
  "EBikeRide",
  "Elliptical",
  "EMountainBikeRide",
  "Golf",
  "GravelRide",
  "Handcycle",
  "HighIntensityIntervalTraining",
  "Hike",
  "IceSkate",
  "InlineSkate",
  "Kayaking",
  "Kitesurf",
  "MountainBikeRide",
  "NordicSki",
  "Pickleball",
  "Pilates",
  "Racquetball",
  "Ride",
  "RockClimbing",
  "RollerSki",
  "Rowing",
  "Run",
  "Sail",
  "Skateboard",
  "Snowboard",
  "Snowshoe",
  "Soccer",
  "Squash",
  "StairStepper",
  "StandUpPaddling",
  "Surfing",
  "Swim",
  "TableTennis",
  "Tennis",
  "TrailRun",
  "Velomobile",
  "VirtualRide",
  "VirtualRow",
  "VirtualRun",
  "Walk",
  "WeightTraining",
  "Wheelchair",
  "Windsurf",
  "Workout",
  "Yoga"
];

// Options for 'trainer' attribute dropdown
export const trainerTypes = ["True", "False"];

export const sportIcon = (sportType: string) => {
  switch (sportType) {
    case "AlpineSki":
      return "🎿";
    case "BackcountrySki":
      return "🎿";
    case "Badminton":
      return "🏸";
    case "Canoeing":
      return "🛶";
    case "Crossfit":
      return "🏋️";
    case "EBikeRide":
      return "🚴";
    case "Elliptical":
      return "🏃";
    case "EMountainBikeRide":
      return "🚴";
    case "Golf":
      return "⛳";
    case "GravelRide":
      return "🚴";
    case "Handcycle":
      return "🚴";
    case "HighIntensityIntervalTraining":
      return "🏋️";
    case "Hike":
      return "🥾";
    case "IceSkate":
      return "⛸️";
    case "InlineSkate":
      return "🛼";
    case "Kayaking":
      return "🚣";
    case "Kitesurf":
      return "🪁";
    case "MountainBikeRide":
      return "🚴";
    case "NordicSki":
      return "🎿";
    case "Pickleball":
      return "🏓";
    case "Pilates":
      return "🧘";
    case "Racquetball":
      return "🏸";
    case "Ride":
      return "🚴";
    case "RockClimbing":
      return "🧗";
    case "RollerSki":
      return "🎿";
    case "Rowing":
      return "🚣";
    case "Run":
      return "🏃";
    case "Sail":
      return "⛵";
    case "Skateboard":
      return "🛹";
    case "Snowboard":
      return "🏂";
    case "Snowshoe":
      return "🏂";
    case "Soccer":
      return "⚽";
    case "Squash":
      return "🏸";
    case "StairStepper":
      return "🏃";
    case "StandUpPaddling":
      return "🏄";
    case "Surfing":
      return "🏄";
    case "Swim":
      return "🏊";
    case "TableTennis":
      return "🏓";
    case "Tennis":
      return "🎾";
    case "TrailRun":
      return "🏃";
    case "Velomobile":
      return "🚴";
    case "VirtualRide":
      return "🚴";
    case "VirtualRow":
      return "🚣";
    case "VirtualRun":
      return "🏃";
    case "Walk":
      return "🚶";
    case "WeightTraining":
      return "🏋️";
    case "Wheelchair":
      return "♿";
    case "Windsurf":
      return "🏄";
    case "Workout":
      return "🏋️";
    case "Yoga":
      return "🧘";
    default:
      return "🏃";
  }
}