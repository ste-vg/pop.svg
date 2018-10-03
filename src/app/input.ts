import { Observable, fromEvent, merge } from "rxjs";
import { map } from "rxjs/operators";
import { Point } from "./Point";

export class Input
{
    private mouseDowns:Observable<any>;
    private mouseMoves:Observable<any>;
    private mouseUps:Observable<any>;

    private touchStarts:Observable<any>;
    private touchMoves:Observable<any>;
    private touchEnds:Observable<any>;

    public starts:Observable<any>;
    public moves:Observable<any>;
    public ends:Observable<any>;

    constructor(element:HTMLElement)
    {
        this.mouseDowns = fromEvent(element, "mousedown").pipe(map(this.mouseEventToCoordinate));
        this.mouseMoves = fromEvent(window, "mousemove").pipe(map(this.mouseEventToCoordinate));
        this.mouseUps = fromEvent(window, "mouseup").pipe(map(this.mouseEventToCoordinate));

        this.touchStarts = fromEvent(element, "touchstart").pipe(map(this.touchEventToCoordinate))
        this.touchMoves = fromEvent(element, "touchmove").pipe(map(this.touchEventToCoordinate))
        this.touchEnds = fromEvent(window, "touchend").pipe(map(this.touchEventToCoordinate));

        this.starts = merge(this.mouseDowns, this.touchStarts);
        this.moves = merge(this.mouseMoves, this.touchMoves);
        this.ends = merge(this.mouseUps, this.touchEnds);
    }

    private mouseEventToCoordinate = (mouseEvent:any):Point => 
    {
        mouseEvent.preventDefault();
        return {
            x: mouseEvent.clientX, 
            y: mouseEvent.clientY
        };
    };

    private touchEventToCoordinate = (touchEvent:any):Point => 
    {
        touchEvent.preventDefault();
        return {
            x: touchEvent.changedTouches[0].clientX, 
            y: touchEvent.changedTouches[0].clientY
        };
    };
}