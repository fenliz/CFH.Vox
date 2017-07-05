export class Matrix4 {
    public static Zero: Matrix4 = new Matrix4(0, 0, 0, 0,
                                              0, 0, 0, 0,
                                              0, 0, 0, 0,
                                              0, 0, 0, 0);
    public static Identity: Matrix4 = new Matrix4(1, 0, 0, 0,
                                                  0, 1, 0, 0,
                                                  0, 0, 1, 0,
                                                  0, 0, 0, 1);

    constructor(public M11: number = 0, public M12: number = 0, public M13: number = 0, public M14: number = 0,
                public M21: number = 0, public M22: number = 0, public M23: number = 0, public M24: number = 0,
                public M31: number = 0, public M32: number = 0, public M33: number = 0, public M34: number = 0,
                public M41: number = 0, public M42: number = 0, public M43: number = 0, public M44: number = 0) {

    }
}
