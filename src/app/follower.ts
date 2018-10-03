import { Point } from "./Point";
import { Input } from "./input";
import { distinctUntilChanged, map } from 'rxjs/operators';

export class Follower
{
    public path:SVGPathElement;
    public ready:boolean = false;

    private count:number = 0;
    private points:{code:string, point:Point}[] = [];

    constructor(container:any, maxPoints:number)
    {
        this.path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        container.append(this.path);

        let input = new Input(container);

		input.moves.pipe(distinctUntilChanged((a:Point, b:Point) => a.x == b.x && a.y == b.y))
			.subscribe((point:Point) => {
                
                this.count++;
                let code = this.count % 2 == 0 ? 'L' : '';
                this.points.unshift({code: code, point: point});
                if(this.points.length > maxPoints) this.points.pop();

                this.path.setAttribute('d', this.createPathString(this.points))
            })
    }

    createPathString(points:any[]):string
    {
        let path:string = '';
        for(let i = 0; i < points.length; i++)
        {
            let code = points[i].code;
            if(i == 0) code = 'M';
            if(i == 1 && points[i].code == '') code = "L";
            if(i == points.length - 1 && points[i].code == 'Q') code = 'L';

            path += `${code} ${points[i].point.x} ${points[i].point.y}`;
        }

        return path;
    }
}