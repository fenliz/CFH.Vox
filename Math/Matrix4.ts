export class Matrix4 {
    static Zero: Matrix4 = new Matrix4(0, 0, 0, 0,
                                       0, 0, 0, 0,
                                       0, 0, 0, 0,
                                       0, 0, 0, 0);
    static Identity: Matrix4 = new Matrix4(1, 0, 0, 0,
                                           0, 1, 0, 0,
                                           0, 0, 1, 0,
                                           0, 0, 0, 1);

    constructor(M11: number = 0, M12: number = 0, M13: number = 0, M14: number = 0,
                M21: number = 0, M22: number = 0, M23: number = 0, M24: number = 0,
                M31: number = 0, M32: number = 0, M33: number = 0, M34: number = 0,
                M41: number = 0, M42: number = 0, M43: number = 0, M44: number = 0) {

    }
}