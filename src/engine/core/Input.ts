export class Input {
    private static keys: Set<string> = new Set();
    private static keysPressed: Set<string> = new Set();

    public static init() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys.has(e.code)) {
                this.keysPressed.add(e.code);
            }
            this.keys.add(e.code);
        });

        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.code);
            this.keysPressed.delete(e.code);
        });
    }

    // Call this at the end of the frame to clear single-frame presses
    public static update() {
        this.keysPressed.clear();
    }

    public static isDown(code: string): boolean {
        return this.keys.has(code);
    }

    public static isPressed(code: string): boolean {
        return this.keysPressed.has(code);
    }
}