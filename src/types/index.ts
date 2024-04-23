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