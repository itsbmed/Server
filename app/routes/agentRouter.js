const router = require("express").Router();
const agentController = require("../controllers/agentController");
const protectRouter = require("../middlewares/protectRouter");

router.post("/sign-in", agentController.signIn);
router.post("/sign-up", protectRouter, agentController.signUp);
router.delete("/agents", protectRouter, agentController.deleteAgent);
router.get("/agents", protectRouter, agentController.getAgents);
router.put(
    "/agents/:userName",
    protectRouter,
    agentController.updateSpecificAgent
);
module.exports = router;
