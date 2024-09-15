function myCanDrag(wrapped, ...args) {
	const canDrag = wrapped(...args);
	try {
		if (
			!game.user.isGM &&
			((game.settings.get("noplayerdrag", "disablePlayerDrag") && !this.inCombat) ||
				(game.settings.get("noplayerdrag", "disablePlayerDragCombat") && this.inCombat))
		)
			return false;
	} catch (err) {
		console.error(err);  // Changed console.err to console.error
	}
	return canDrag;
}

Hooks.once("ready", function () {
	if (game.modules.get("lib-wrapper")?.active) {
		libWrapper.register("noplayerdrag", "Token.prototype.canUserModify", myCanDrag, "WRAPPER");  // Updated from _canDrag to canUserModify
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
		hint: `Non-GM players cannot drag tokens that are in combat and must use WASD/Arrow keys.`,
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
	});
});
