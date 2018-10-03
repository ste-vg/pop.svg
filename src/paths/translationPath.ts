import { ReferencePath } from "./referencePath";
import { Point } from "./Point";
import { CommandPath } from "./commands";

export class TranslationPath
{
    path:SVGPathElement;
    width:number;
    endWidth:number;
    length:number = 0;

    constructor(element:any, width:number, endWidth?:number)
    {
        this.path = element;
        this.width = width;
        this.endWidth = endWidth !== undefined ? endWidth : width;
        this.updatePath();
    }

    updatePath()
    {
        this.length = this.path.getTotalLength();
    }

    getPath(path:ReferencePath, width?: number, endWidth?:number):string
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
                    let yValue = y ? command['p' + y] :  lastPoint.y;

                    lastPoint.x = xValue;
                    lastPoint.y = yValue;

                    let newPoint = this.percentToPath(xValue, yValue, width || this.width, endWidth || this.endWidth);

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

    percentToPath(x:number, y:number, width:number, endWidth:number):Point
    {
        let angleDistance = 0.01;
        let pt = this.path.getPointAtLength(this.length * y);
        let anglePt = y < angleDistance ? this.path.getPointAtLength(this.length * (y + angleDistance)) : this.path.getPointAtLength(this.length * (y - angleDistance));

        let rotation = this.getRotation(y < angleDistance ? anglePt : pt, y < angleDistance ? pt : anglePt);

        let w = this.getWidth(y, width, endWidth);

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