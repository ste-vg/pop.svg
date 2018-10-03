export class CommandPath
{
    static keys:any = {
        M: ['x', 'y'],
        L: ['x', 'y'],
        V: ['y'],
        H: ['x'],
        C: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
        S: ['x2', 'y2', 'x', 'y'],
        Q: ['x1', 'y1', 'x', 'y'],
        T: ['x', 'y'],
        A: ['rx', 'ry', 'xAxisRotation', 'largeArc', 'sweep', 'x', 'y'],
        Z: []
    }

    static ignoreWhenSizing = ['rx', 'ry', 'xAxisRotation', 'largeArc', 'sweep'];
}
