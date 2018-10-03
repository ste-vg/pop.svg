import './app.scss';

import { ReferencePath } from './Paths/referencePath';
import { TranslationPath } from './Paths/translationPath';
import { Follower } from './follower';
import { Lerper } from './lerper';

export class App
{
    svg:Element | null;
    container:HTMLElement;

    private width: number = 600;
    private height: number = 600;
    
    //private follower:Lerper | null = null;
    private follower:Follower | null = null;
    private followTranslator:TranslationPath | null = null;

    private pencilElements:any[] = [];
    private pencilRefernces:ReferencePath[] = [];
    private pencilTranslated:SVGPathElement[] = [];

    constructor(container:HTMLElement)
    {
		this.container = container;

		this.svg = document.getElementById('stage');
		window.addEventListener('resize', () => this.onResize())
        this.onResize();

        this.start();
    }

    start()
    {
        //containers
        let guideContainer = document.getElementById('guide');
        let translatedContainer = document.getElementById('translated');

        let pencilElements = document.getElementsByClassName('pencil');

    
        if(guideContainer && translatedContainer)
        {
             //this.follower = new Lerper(guideContainer, 40, {x: 7, y: -7}, 1);
             this.follower = new Follower(guideContainer, 20);
             this.followTranslator = new TranslationPath(this.follower.path, 60);

            for(let i = 0; i < pencilElements.length; i++)
            {
                let ref = new ReferencePath(pencilElements[i], 200, {x: 0, y: 0}, {x:122, y:507});
                this.pencilRefernces.push(ref);
                let translated = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                translated.setAttribute('style', pencilElements[i].getAttribute('style') || '')
                this.pencilTranslated.push(translated);
                translated.setAttribute("d", this.followTranslator.getPath(ref));
                translatedContainer.appendChild(translated);
            }

            this.tick();
        }


    }

    tick()
    {
        if(this.followTranslator)
        {
            this.followTranslator.updatePath();

            for(let i = 0; i < this.pencilRefernces.length; i++)
            {
                let ref = this.pencilRefernces[i];
                let translated = this.pencilTranslated[i];
                translated.setAttribute("d", this.followTranslator.getPath(ref));
            }
        }

        requestAnimationFrame(() => { this.tick() });
    }

    createLinesPath():any
    {
        let path = document.getElementById('lines');

        let linesPath = '';
        let lineCount = 71;

        for(let i = 0; i < lineCount; i++)
        {
            linesPath += `M 0 ${i* 2} H 10`;
        }

        if(path) path.setAttribute('d', linesPath);

        return path;
    }

    onResize()
	{
		this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        
        if(this.svg)
        {
            this.svg.setAttribute('width', String(this.width));
            this.svg.setAttribute('height', String(this.height));
        }
	}
}