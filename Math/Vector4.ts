export class Vector4 {
    static Zero:  Vector4 = new Vector4(0, 0, 0, 0);
    static One:   Vector4 = new Vector4(1, 1, 1, 1);
    static UnitX: Vector4 = new Vector4(1, 0, 0, 0);
    static UnitY: Vector4 = new Vector4(0, 1, 0, 0);
    static UnitZ: Vector4 = new Vector4(0, 0, 1, 0);
    static UnitW: Vector4 = new Vector4(0, 0, 0, 1);

    constructor(public X: number = 0, 
                public Y: number = 0,
                public Z: number = 0, 
                public W: number = 0) {
        
    }

    public Negate(): Vector4 {
        return new Vector4(-this.X, -this.Y, -this.Z, -this.W);
    }
}