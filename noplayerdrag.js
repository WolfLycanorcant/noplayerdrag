// Custom function to check if players can drag tokens
function myCanDrag(wrapped, ...args) {
    const canDrag = wrapped(...args);
    try {
        // Ensure game.user is defined before accessing its properties
        if (game.user && 
            !game.user.isGM &&
            (
                (game.settings.get("noplayerdrag", "disablePlayerDrag") && !this.inCombat) || 
                (game.settings.get("noplayerdrag", "disablePlayerDragCombat") && this.inCombat)
            )
        ) {
            return false; // Prevent non-GM token drag based on settings
        }
    } catch (err) {
        console.error("Error in myCanDrag:", err);
    }
    return canDrag;
}

// Hook to execute once Foundry is ready
Hooks.once("ready", function () {
    // Ensure lib-wrapper is installed and active
    if (game.modules.get("lib-wrapper")?.active) {
        libWrapper.register("noplayerdrag", "Token.prototype.canUserModify", myCanDrag, "WRAPPER");
    }
});

// Initialize module settings
Hooks.once("init", () => {
    // Setting to disable token drag outside of combat
    game.settings.register("noplayerdrag", "disablePlayerDrag", {
        name: "Disable token drag outside combat",
        hint: "Non-GM players cannot drag tokens and must use WASD/Arrow keys outside of combat.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
    });

    // Setting to disable token drag during combat
    game.settings.register("noplayerdrag", "disablePlayerDragCombat", {
        name: "Disable drag token in combat",
        hint: "Non-GM players cannot drag tokens while in combat and must use WASD/Arrow keys.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
    });
});
