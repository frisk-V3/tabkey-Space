/**
 * Tabキーを浄化し、型安全なスペースへと昇華させるエンジン
 */
export class SpaceEngine {
  private readonly spaceString: string;

  constructor(private readonly spaceCount: number = 2) {
    this.spaceString = " ".repeat(this.spaceCount);
  }

  /**
   * イベントをインターセプトしてスペースを注入する
   */
  public handleTabEvent(e: KeyboardEvent): void {
    const target = e.target;

    // 編集可能な要素かチェック (型ガード)
    if (!(target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement)) {
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      this.injectSpaces(target);
    }
  }

  private injectSpaces(el: HTMLTextAreaElement | HTMLInputElement): void {
    const { selectionStart, selectionEnd, value } = el;

    // 歴史的経緯(Undo)を保持しつつ文字を挿入するモダンな手法
    // ※一部ブラウザで非推奨だが、現状最も確実にUndoが効く
    if (!document.execCommand('insertText', false, this.spaceString)) {
      // フォールバック: 手動で値を置換（Undoは壊れるが確実に動く）
      el.value = 
        value.substring(0, selectionStart!) + 
        this.spaceString + 
        value.substring(selectionEnd!);
      
      el.selectionStart = el.selectionEnd = selectionStart! + this.spaceCount;
    }
  }
}
