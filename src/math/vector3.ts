export class Vector3 {
    public static Zero: Vector3 = new Vector3(0, 0, 0);
    public static One: Vector3 = new Vector3(1, 1, 1);
    public static UnitX: Vector3 = new Vector3(1, 0, 0);
    public static UnitY: Vector3 = new Vector3(0, 1, 0);
    public static UnitZ: Vector3 = new Vector3(0, 0, 1);

    constructor(public X: number = 0,
                public Y: number = 0,
                public Z: number = 0) {

    }

    public Negate(): Vector3 {
        return new Vector3(-this.X, -this.Y, -this.Z);
    }
}
