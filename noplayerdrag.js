function myCanDrag(wrapped, ...args) {
    const canDrag = wrapped(...args);
    try {
        // Check if game.user is defined before trying to access properties
        if (game.user && 
            !game.user.isGM &&
            ((game.settings.get("noplayerdrag", "disablePlayerDrag") && !this.inCombat) ||
                (game.settings.get("noplayerdrag", "disablePlayerDragCombat") && this.inCombat))
        )
            return false;
    } catch (err) {
        console.error(err);  // Ensure proper logging for errors
    }
    return canDrag;
}

Hooks.once("ready", function () {
    // Ensure lib-wrapper is active
    if (game.modules.get("lib-wrapper")?.active) {
        libWrapper.register("noplayerdrag", "Token.prototype.canUserModify", myCanDrag, "WRAPPER");
    }
});

Hooks.once("init", () => {
    game.settings.register("noplayerdrag", "disablePlayerDrag", {
        name: `Disable token drag outside combat`,
        hint: `Non-GM players cannot drag tokens and must use WASD/Arrow keys outside of combat.`,
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
    });
    game.settings.register("noplayerdrag", "disablePlayerDragCombat", {
        name: `Disable token drag in combat`,
        hint: `Non-GM players cannot drag tokens while in combat and must use WASD/Arrow keys.`,
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
    });
});
