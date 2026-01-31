/**
 * 对话系统 - 处理游戏中的对话显示
 */

import Phaser from 'phaser';
import { GAME_CONSTANTS } from '../config';
import { DialogueData } from '../types';

export class DialogueSystem extends Phaser.Events.EventEmitter {
  private scene: Phaser.Scene;
  private dialogueBox!: Phaser.GameObjects.Container;
  private dialogueText!: Phaser.GameObjects.Text;
  private speakerText!: Phaser.GameObjects.Text;
  private currentDialogues: DialogueData[] = [];
  private currentIndex: number = 0;
  private isTyping: boolean = false;
  private typingTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene) {
    super();
    this.scene = scene;
    this.createDialogueBox();
  }

  private createDialogueBox(): void {
    const { width, height } = this.scene.cameras.main;

    // 对话框容器
    this.dialogueBox = this.scene.add.container(0, height - 150);

    // 背景
    const background = this.scene.add.rectangle(
      width / 2,
      75,
      width - 40,
      140,
      0x000000,
      0.9
    );
    background.setStrokeStyle(2, 0xffffff);
    this.dialogueBox.add(background);

    // 说话人名称
    this.speakerText = this.scene.add.text(20, 10, '', {
      font: 'bold 18px Arial',
      color: '#ffcc00',
    });
    this.dialogueBox.add(this.speakerText);

    // 对话文本
    this.dialogueText = this.scene.add.text(20, 40, '', {
      font: '16px Arial',
      color: '#ffffff',
      wordWrap: { width: width - 80 },
      lineSpacing: 8,
    });
    this.dialogueBox.add(this.dialogueText);

    // 继续提示
    const continueText = this.scene.add.text(width - 60, 120, '▼', {
      font: '20px Arial',
      color: '#ffffff',
    });
    this.dialogueBox.add(continueText);

    // 初始隐藏
    this.dialogueBox.setVisible(false);
  }

  public show(dialogues: DialogueData[]): void {
    this.currentDialogues = dialogues;
    this.currentIndex = 0;
    this.dialogueBox.setVisible(true);
    this.emit('dialogue-start');
    this.showCurrentDialogue();
  }

  private showCurrentDialogue(): void {
    if (this.currentIndex >= this.currentDialogues.length) {
      this.hide();
      return;
    }

    const dialogue = this.currentDialogues[this.currentIndex];
    if (!dialogue) return;

    // 设置说话人
    if (dialogue.speaker) {
      this.speakerText.setText(dialogue.speaker);
      this.speakerText.setVisible(true);
    } else {
      this.speakerText.setVisible(false);
    }

    // 打字机效果显示文本
    this.typeText(dialogue.text);
  }

  private typeText(text: string): void {
    this.isTyping = true;
    this.dialogueText.setText('');
    let currentIndex = 0;

    if (this.typingTimer) {
      this.typingTimer.destroy();
    }

    this.typingTimer = this.scene.time.addEvent({
      delay: GAME_CONSTANTS.DIALOG_TYPING_SPEED,
      callback: () => {
        currentIndex++;
        this.dialogueText.setText(text.substring(0, currentIndex));

        if (currentIndex >= text.length) {
          this.isTyping = false;
          this.typingTimer?.destroy();
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  public advance(): void {
    if (this.isTyping) {
      // 如果正在打字，立即完成
      if (this.typingTimer) {
        this.typingTimer.destroy();
      }
      const dialogue = this.currentDialogues[this.currentIndex];
      if (dialogue) {
        this.dialogueText.setText(dialogue.text);
      }
      this.isTyping = false;
    } else {
      // 执行当前对话的完成回调
      const dialogue = this.currentDialogues[this.currentIndex];
      if (dialogue?.onComplete) {
        dialogue.onComplete();
      }

      // 显示下一条对话
      this.currentIndex++;
      this.showCurrentDialogue();
    }
  }

  public hide(): void {
    this.dialogueBox.setVisible(false);
    this.emit('dialogue-end');
  }

  public isActive(): boolean {
    return this.dialogueBox.visible;
  }
}
