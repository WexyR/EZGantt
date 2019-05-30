//module "state.ts" {
var State;
(function (State) {
    State[State["Not_Scheduled"] = 0] = "Not_Scheduled";
    State[State["Scheduled"] = 1] = "Scheduled";
    State[State["In_Progress"] = 2] = "In_Progress";
    State[State["Urgent"] = 3] = "Urgent";
    State[State["Active"] = 4] = "Active";
    State[State["Alongside"] = 5] = "Alongside";
    State[State["Skipped"] = 6] = "Skipped";
    State[State["Completed"] = 7] = "Completed";
    State[State["Failed"] = 8] = "Failed";
})(State || (State = {}));
//}
