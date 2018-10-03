import { parseSVG, makeAbsolute } from "svg-path-parser";
import { Point } from "../Point";
import { CommandPath } from "./commands";

export class ReferencePath
{
    commands: any[];

    constructor(element:any, breakup?:number, min?:Point, max?:Point)
    {
        const isString = typeof element == 'string';
        let pathString = '';

        if(isString)
        {
            pathString = element;
            this.commands = makeAbsolute(parseSVG(pathString || ''));
        }
        else
        {
            let path:SVGPathElement = element;
            pathString = path.getAttribute('d') || '';
            this.commands = makeAbsolute(parseSVG(pathString || ''));

            if(breakup && breakup > 3)
            {
                if(this.commands[0].code == 'M')
                {
                    pathString = `M ${this.commands[0].x} ${this.commands[0].y}`;
                }
                else
                {
                    pathString = 'M 0 0';
                }

                let length = path.getTotalLength();

                for(let i = 1; i <= breakup; i++)
                {
                    let percent = i / breakup;
                    let pt = path.getPointAtLength(length * percent);
                    pathString += `L ${pt.x} ${pt.y}`;
                }

                this.commands = makeAbsolute(parseSVG(pathString || ''));
            }
        }
        

        this.normalize(min, max);
    }

    normalize(min:Point = {x: this.commands[0].x, y: this.commands[0].y}, max:Point = {x: this.commands[0].x, y: this.commands[0].y})
    {
 
        if(this.commands.length > 0)
        {
           
                let ignore = CommandPath.ignoreWhenSizing;

                this.commands.map((d:any) => 
                {
                    let keys:any = CommandPath.keys[d.code];

                    keys.map((key:string) => 
                    {
                        let ignoreIndex = ignore.indexOf(key);
                        if(ignoreIndex == -1)
                        {
                            let direction:string = key.charAt(0);
                            if(direction == 'x' || direction == 'y')
                            {
                                if(min[direction] == null || d[key] < min[direction]) min[direction] = d[key];
                                if(max[direction] == null || d[key] > max[direction]) max[direction] = d[key];
                            }
                        }
                    })
                })

                max.x -= min.x;
                max.y -= min.y;
            

            this.commands.map((d:any) => 
            {
                let keys:any = CommandPath.keys[d.code];

                keys.map((key:string) => 
                {
                    let ignoreIndex = ignore.indexOf(key);
                    if(ignoreIndex == -1)
                    {
                        let direction:string = key.charAt(0);
                        if(direction == 'x' || direction == 'y')
                        {
                            d[key] -= min[direction];
                            d['p' + key] = (d[key] / max[direction]) * 1;
                        }
                    }
                })
            })
        }
    }
}