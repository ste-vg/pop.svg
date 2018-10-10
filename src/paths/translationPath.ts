import { ReferencePath } from "./referencePath";
import { Point } from "./Point";
import { CommandPath } from "./commands";

interface PointInfo
{
    position: Point;
    rotation: number;
}

export class TranslationPath
{
    path:SVGPathElement;
    width:number;
    endWidth:number;
    length:number = 0;

    percentFidelity:number;
    percentLookup:PointInfo[] = [];

    constructor(element:any, width:number, endWidth?:number, fidelity:number = 0.001)
    {
        this.percentFidelity = fidelity;
        this.path = element;
        this.width = width;
        this.endWidth = endWidth !== undefined ? endWidth : width;
        this.updatePath();
    }

    updatePath()
    {
        this.length = this.path.getTotalLength();

        let count = 0;
        while(count <= 1)
        {
            let nextCount = count + this.percentFidelity;
            let lastCount = count - this.percentFidelity;

            let position = this.path.getPointAtLength(this.length * count);
            let anglePosition = {x: 0, y:0 };
            let rotation = 0;

            if(nextCount > 1)
            {
                anglePosition = this.path.getPointAtLength(this.length * lastCount);
                rotation = this.getRotation(anglePosition, position);
            }
            else
            {
                anglePosition = this.path.getPointAtLength(this.length * nextCount);
                rotation = this.getRotation(position, anglePosition);
            }
            
            this.percentLookup.push({position: position, rotation: rotation});
            count += this.percentFidelity;
           // if(count > 1) count = 1;
        }
    }

    getPath(path:ReferencePath, width?: number, endWidth?:number, start:number = 0, end:number = 1):string
    {
        let newPath = '';
        let lastPoint = {x: 0, y: 0};

        path.commands.map((command:any) => 
        {
            let ignoreCodes = ['A'];

            if(ignoreCodes.indexOf(command.code) == -1)
            {
                let code = command.code;
                if(code == 'V' || code == 'H') code = 'L';
                newPath += code;

                let keys:any = CommandPath.keys[command.code];

                for(let i = 0; i < keys.length; i += 2)
                {
                    let direction:string = keys[i].charAt(0);
                    let x = direction == 'x' ? keys[i] : null;
                    let y = direction == 'y' ? keys[i] : keys[i+1] != null ? keys[i+1] : null;

                    let xValue = x ? command['p' + x] : lastPoint.x;
                    let yValue = y ? command['p' + y] : lastPoint.y;

                    lastPoint.x = xValue;
                    lastPoint.y = yValue;

                    let newPoint = this.percentToPath(xValue, yValue, width || this.width, endWidth || this.endWidth, start, end);

                    newPath += ' ' + newPoint.x;
                    newPath += ' ' + newPoint.y;
                    
                }
            }
        })

        return newPath;
    }

    getWidth(yPercent:number, width:number, endWidth:number)
    {
        let w = endWidth - width;
        let newWidth = width + (w * yPercent);
        return newWidth;
    }

    getPointAtLength(percentage:number):PointInfo
    {
        let p = Math.round(percentage / this.percentFidelity);

        if(p >= this.percentLookup.length) return this.percentLookup[this.percentLookup.length - 1];
        if(p < 0) return this.percentLookup[0];
        return this.percentLookup[p];
    }

    percentToPath(x:number, y:number, width:number, endWidth:number, start:number, end:number):Point
    {
        let angleDistance = 0.01;
        let p = y * (end - start) + start;

        let pointInfo = this.getPointAtLength(p);
        let pt = pointInfo.position;
        let rotation = pointInfo.rotation;

        let w = this.getWidth(p, width, endWidth);

        let origin:Point = {x: pt.x, y: pt.y};
        let target:Point = {x: pt.x - (w / 2) + (w * x), y: pt.y};

        let toReturn:Point = this.getRotatedPoint(
            origin,
            target,
            rotation
        )

        return toReturn
    }

    getRotation(p1:Point, p2: Point):number
    {
        var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return angleRadians;
    }

    getRotatedPoint(origin:Point, point:Point, angle:number): Point
    {
        let newPoint:Point = {
            x: point.x - origin.x,
            y: point.y - origin.y
        }

        const x = newPoint.x;
        const y = newPoint.y;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        newPoint.y = (cos * x) + (sin * y);
        newPoint.x = (cos * y) - (sin * x);

        newPoint.x += origin.x;
        newPoint.y += origin.y;

        return newPoint;
    }
}