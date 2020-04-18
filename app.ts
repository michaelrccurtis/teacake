import { Schema, Fields } from "./src";
import Field from "./src/fields/base"

const backEndGoal = {
  id: "b52b8ff0-7fc4-11ea-ab40-57c95650a19c",
  back_end_field: "field",
};

const frontEndGoal = {
  nodeType: "goal",
  id: "b52b8ff0-7fc4-11ea-ab40-57c95650a19c",
  type: "buy_home_goal",
  needsInitialConversation: false,
  // integrations: [],
  name: "Buy a home",
  movingCosts: 600,
  legalFees: 1200,
  calculatePropertyTax: false,
  propertyTax: 32850,
  targetDate: "04/2023",
  depositPct: 10,
  buyingJointly: true,
  firstTimeBuyer: false,
  propertyType: "primary",
  savingsEarmarked: 25000,
  location: "england",
  area: "London",
  targetSavingsPerMonth: 2500,
  depositValue: 84950,
  jointBuyerName: "Joanna",
  jointBuyerSavingsEarmarked: 1000,
  jointBuyerFirstTimeBuyer: true,
  jointBuyerTargetSavingsPerMonth: 100,
  jointBuyerAnnualSalary: 30000,
};

interface FieldObject {
  [key: string]: Field
}

const goalSchema = new Schema({
  id: Fields.String(),
}, {
  attributeMap: {
    id: 'native' as const
  },
  dataKeyMap: {
    id: 'back_end_field' as const
  }
});


const loaded = goalSchema.load(backEndGoal);

console.log("Load", loaded);
console.log("Dump", goalSchema.dump(backEndGoal));
