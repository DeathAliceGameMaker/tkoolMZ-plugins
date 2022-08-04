//=============================================================================
// DA_NotMirrorAnimation.js
//=============================================================================
/*
 * 
 * @target MZ
 * @file DA_NotMirrorAnimation
 * @plugindesc Prevents allied animations from flipping in side view combat.
 * @author DeathAlice
 * @version 1.0
 * 
 * @help
 * Prefixing the animation name with a ``!'' will prevent side-view combat ally animations from flipping.
 * Example: !fire
 * 
 */
 
/*:ja
 * 
 * @target MZ
 * @file DA_NotMirrorAnimation
 * @plugindesc サイドビュー戦闘で味方のアニメーションを反転させないようにします。
 * @author DeathAlice
 * @version 1.0
 *
 * @help
 * アニメーションの名前の先頭に「!」を入れることでサイドビュー戦闘の味方のアニメーションが反転しなくなります。
 * 例：!ファイア
 * 
 */

(() => {
    Sprite_Animation.prototype.setProjectionMatrix = function(renderer) {
        const firstChar = this._animation.name.charAt(0);
        const x = this._mirror && !firstChar.includes('!') ? -1 : 1;
        const y = -1;
        const p = -(this._viewportSize / renderer.view.height);
        // prettier-ignore
        Graphics.effekseer.setProjectionMatrix([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, 1, p,
            0, 0, 0, 1,
        ]);
    };
})();