import { Point } from "./Point";
import { Input } from "./input";
import { distinctUntilChanged, map } from 'rxjs/operators';

export class Lerper
{
    public path:SVGPathElement;
    public ready:boolean = false;
    
    private points:Point[] = [];
    private target:Point;
    private offset:Point;
    private speed:number;

    constructor(container:any, pointsCount:number, offset:Point, speed:number)
    {
        this.path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        container.append(this.path);

        this.offset = offset;
        this.speed = speed;

        let input = new Input(container);

        for(let i = 0; i < pointsCount; i++)
        {
            this.points.push({
                x: i * offset.x,
                y: i * offset.y
            })
        }

        this.target = {x:0, y:0};

		input.moves.pipe(distinctUntilChanged((a:Point, b:Point) => a.x == b.x && a.y == b.y))
			.subscribe((point:Point) => { this.target = point;})

            this.tick();
    }

    tick()
    {
        for(let i = 0; i < this.points.length; i++)
        {
            let p = this.points[i];
            let dx = (this.target.x + (i * this.offset.x)) - p.x;
            let dy = (this.target.y + (i * this.offset.y)) - p.y;

            let speed = this.speed - (i / this.points.length) * this.speed;

            this.points[i].x += dx * speed;
            this.points[i].y += dy * speed;
            //this.points[i].y = point.y + (this.points[i].y / 1 + (i * speed))
        }

        this.path.setAttribute('d', this.createPathString(this.points))

        requestAnimationFrame(() => this.tick());
    }

    createPathString(points:Point[]):string
    {
        let path:string = '';
        for(let i = 0; i < points.length; i++)
        {
            let code = i == 0 ? 'M' :  "L";
            path += `${code} ${points[i].x} ${points[i].y}`;
        }

        return path;
    }
}