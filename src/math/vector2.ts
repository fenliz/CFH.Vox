export class Vector2 {
    public static Zero: Vector2 = new Vector2(0, 0);
    public static One: Vector2 = new Vector2(1, 1);
    public static UnitX: Vector2 = new Vector2(1, 0);
    public static UnitY: Vector2 = new Vector2(0, 1);

    constructor(public X: number = 0,
                public Y: number = 0) {

    }

    public Negate(): Vector2 {
        return new Vector2(-this.X, -this.Y);
    }
}
