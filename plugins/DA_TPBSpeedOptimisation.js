//=============================================================================
// DA_TPBSpeedOptimisation.js
//=============================================================================
/*
 * 
 * @target MZ
 * @file DA_TPBSpeedOptimisation
 * @plugindesc TPB speed optimization
 * @author DeathAlice
 * @version 1.0
 *
 * @param Proportionation
 * @type boolean
 * @text Make speed correction a percentage notation
 * @desc Make it easier to adjust the cast time by setting the speed correction to the ratio value.
 * @on ON
 * @off OFF
 * @default false
 *
 * @help
 * 【About the speed at which the gauge of the time progress battle accumulates】
 * Conventional TPB speed is the square root of each character's agility plus +1 but it is the square root of the agility of each character and the'difference of agility'.
 * Difference in agility: Maximum agility of all combat characters-Minimum agility of all combat characters
 * As a result, the number of actions n becomes "the character with the lowest agility <= n <2", and even if there is an extreme difference in agility, it can be recovered.
 * Therefore, the TPB speed when the agility is buffed will also be changed according to the above number of actions.
 *
 * 【About "speed correction in percentage notation"】
 * Furthermore, by setting "Set speed correction to percentage notation" to "ON", the cast time will be changed as follows.
 * Cast time = "Speed ​​correction" Square root of absolute value of negative value / TPB speed
 * ↓
 * Cast time = 100 / Absolute value of negative value "speed correction"
 * This makes it easier to adjust because the cast time is generated by the ratio of the absolute value of the negative value of "speed correction".
 * For example, if you want to act 3 times faster than the charge time, you can triple the normal attack by entering "-300".
 *
 * ■ Terms of Use
 * There are no particular restrictions.
 * Modification, redistribution freedom, commercial availability, and rights display are optional.
 * The author is not responsible, but we will deal with defects to the extent possible.
 *
 */


/*:ja
 * 
 * @target MZ
 * @file DA_TPBSpeedOptimisation
 * @plugindesc TPBスピードの最適化
 * @author DeathAlice
 * @version 1.0
 *
 * @param Proportionation
 * @type boolean
 * @text 速度補正を割合表記にする
 * @desc 速度補正を割合の値にしてキャストタイムを調整しやすくします。
 * @on ON
 * @off OFF
 * @default false
 *
 * @help
 * 【タイムプログレスバトルのゲージの溜まる速度について】
 * 従来のTPBスピードは各キャラクターの敏捷性の平方根に+1した値でしたが、それを各キャラクターの敏捷性と'敏捷性の差分'の平方根の値になります。
 * 敏捷性の差分：戦闘キャラ全体の最大敏捷性 - 戦闘キャラ全体の最小敏捷性
 * これにより行動回数nは 「敏捷性の一番低いキャラ <= n < 2」 となり、敏捷性に極端な差があっても挽回できるようになっています。
 * よって敏捷性にバフがかかった状態のTPBスピードも上記行動回数に沿って変更されます。
 *
 * 【"速度補正を割合表記にする"について】
 * 更に「速度補正を割合表記にする」を「ON」にすることで、キャストタイムが以下のように変更されます。
 * キャストタイム　= 「速度補正」負の値の絶対値の平方根 / TPBスピード
 * 　	↓
 * キャストタイム　=  100 / 負の値の「速度補正」の絶対値
 * これにより負の値にした「速度補正」の絶対値の割合でキャストタイムが生まれるので調整しやすくなります。
 * 例えば、通常攻撃はチャージタイムの3倍の速さで行動したい場合は「-300」と入力することで3倍になります。
 *
 * ■利用規約
 * 特に制約はありません。
 * 改変、再配布自由、商用可、権利表示も任意です。
 * 作者は責任を負いませんが、不具合については可能な範囲で対応します。
 *
 */

(() => {
	"use strict";

	function toBoolean(str)
	{
		if (str == true) {
			return true;
		}
		return (str == "true") ? true : false;
	}

	var parameters = PluginManager.parameters("DA_TPBSpeedOptimisation");
	var _proportionation = toBoolean(parameters.Proportionation);

	Game_Battler.prototype.tpbSpeed = function() {
		return Math.sqrt(this.agi + GetMaxAGI() - GetMinAGI());
	};

	Game_Battler.prototype.tpbBaseSpeed = function() {
		const baseAgility = GetMaxAGI();
		return Math.sqrt(baseAgility);
	};

	Game_Battler.prototype.tpbRequiredCastTime = function() {
		const actions = this._actions.filter(action => action.isValid());
		const items = actions.map(action => action.item());
		const delay = items.reduce((r, item) => r + Math.max(0, -item.speed), 0);
		return (_proportionation) ? (delay != 0) ? 100 / delay : 0 : Math.sqrt(delay) / this.tpbSpeed();
	};


	function GetMaxAGI()
	{
		var maxAGI = 0;
		for(var i = 0; i < $gameParty.members().length ; i++)
		{
			var AGI = $gameParty.members()[i].param(6);
			if(AGI > maxAGI)
			{
				maxAGI = AGI;
			}
		}
		for(var i = 0; i < $gameTroop.members().length ; i++)
		{
			var AGI = $gameTroop.members()[i].param(6);
			if(AGI > maxAGI)
			{
				maxAGI = AGI;
			}
		}
		return maxAGI;
	}

	function GetMinAGI()
	{
		var minAGI = Infinity;
		for(var i = 0; i < $gameParty.members().length; i++)
		{
			var AGI = $gameParty.members()[i].param(6);
			if(AGI < minAGI)
			{
				minAGI = AGI;
			}
		}
		for(var i = 0; i < $gameTroop.members().length ; i++)
		{
			var AGI = $gameTroop.members()[i].param(6);
			if(AGI < minAGI)
			{
				minAGI = AGI;
			}
		}
		return minAGI;
	}

})();