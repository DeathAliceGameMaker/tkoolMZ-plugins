//=============================================================================
// DA_TPBchargeMAX_SE.js
//=============================================================================
/*:
 * @target MZ
 * @file DA_TPBchargeMAX_SE
 * @plugindesc TPBのゲージがたまった時に効果音が流れるプラグイン
 * @author DeathAlice
 * @version 1.0
 *
 * @param chargeMAX_SE
 * @desc ゲージが溜まった時に流れる効果音
 * @text 効果音
 * @type file
 * @dir audio/se/
 * @default
 *
 * @param volume
 * @type number
 * @text ボリューム
 * @desc 効果音の音量
 * @default 90
 *
 * @param pitch
 * @type number
 * @text ピッチ
 * @desc 効果音ピッチ
 * @default 100
 *
 * @param pan
 * @type number
 * @text パン
 * @desc 効果音のパン
 * @default 0
 *
 * @help
 * TPBのゲージがたまった時に効果音が流れるプラグインです。
 */

(() => {
	"use strict";
	var parameters = PluginManager.parameters("DA_TPBchargeMAX_SE");
	const _volume = Number(parameters.volume);
	const _pitch = Number(parameters.pitch);
	const _pan = Number(parameters.pan);
	const _Game_Battler_onTpbCharged = Game_Battler.prototype.onTpbCharged;
	Game_Battler.prototype.onTpbCharged = function() {
		_Game_Battler_onTpbCharged.call(this);
		if(this.isActor())
		{
			AudioManager.playSe({ "name": parameters.chargeMAX_SE, "volume": _volume, "pitch": _pitch, "pan": _pan });
		}
	};

})();
