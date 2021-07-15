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
		if (_proportionation)
		{
			var CastTime = (delay != 0) ?  100 / delay : 0;
		}
		else
		{
			var CastTime = Math.sqrt(delay) / this.tpbSpeed();
		}

		return CastTime;
		//return (parameters.Proportionation) ? (delay != 0) ? 100 / delay : 0 : Math.sqrt(delay) / this.tpbSpeed();
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