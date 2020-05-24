    //let jsonFile = require(`./JSONfile.json`); // JSON


    document.addEventListener('keydown', (event) => {
        keys[event.code] = true;
    });
    document.addEventListener('keyup', (event) => {
        keys[event.code] = false;
    });
    
    const cnv = document.getElementById('canvas');
    const ctx = cnv.getContext('2d');

    let keys = [];

    

    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;


    ctx.font = '48px monospace';
    

    const pSize = 20;

    let isGameOver = false;

    const collides = function (a, b) {
            return (
                a.x < b.x + b.width 
                && a.x + a.width > b.x 
                && a.y < b.y + b.height 
                && a.y + a.height > b.y);
    };

    const apple = {
        x: parseInt(Math.random() * (cnv.width - 20) + 10 ),
        y: parseInt(Math.random() * (cnv.height - 20) + 10 ),
        width: 7.5,
        height: 7.5,
        radius: 10,
        counter: 0,
        collect: function (player) {
            ctx.fillStyle = 'red';
            if (collides(this, player)) {
		this.x = parseInt(Math.random() * (cnv.width - 20) + 10);
		this.y = parseInt(Math.random() * (cnv.height - 20) + 10);
        player.length++;
        this.counter++;
	    };
	    // Конец вставки
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        },
    };

    const player = {
        x: 50,
        y: 50,
        size: pSize,
	    // 2 необходимые строки:
	    height: pSize,
	    width: pSize,
        dx: 20,
        dy: 0,
        segments: [],
        length: 3,
        move: function(){
            
            if(keys['KeyW'] && this.dy == 0 ) {
                this.dx = 0;
                this.dy = -20;
            };
            if(keys['KeyS'] && this.dy == 0 ) {
                this.dx = 0;
                this.dy = 20;
            };
            if(keys['KeyD'] && this.dx == 0 ) {
                this.dx = 20;
                this.dy = 0;
            };
            if(keys['KeyA'] && this.dx == 0 ) {
                this.dx = -20;
                this.dy = 0;
            };

            this.x += this.dx;
            this.y += this.dy;

            this.segments.unshift({x: this.x, y: this.y, width: this.width, height: this.height});

            if (this.segments.length > this.length){
                this.segments.pop();
            };
    
            ctx.fillStyle = 'green';

            for (let i = 1; i < this.segments.length; i++) {
                ctx.fillRect(this.segments[i].x, this.segments[i].y, this.width - 1, this.height - 1);
                if (collides(this.segments[i], player) && !isGameOver) isGameOver = true; 
            };
        },
    };

    const gameOver = () => {
        ctx.fillStyle = '#eeeeee';
        // tx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.fillRect(0, 0, cnv.width, cnv.height);

        ctx.fillStyle = '#000000';
        ctx.fillText("Game Over", 300, 100);
        //ctx.fillRect(cnv.width / 2 - 150, cnv.height / 2 - 50, 300, 100);

        //================{ Рекорд }================
        let jsonRekord = jsonFile.rekord;
        if (apple.counter > jsonRekord) {
            jsonRekord = apple.counter;
        };
        //==========================================
    };

    let frame = 0;

    //================{ Difficulty }================
    // let difficulty = jsonFile.difficulty;
    // let gameDifficulty = 0;
    // if (difficulty == "easy") {
    //     gameDifficulty = 10;
    // } else if (difficulty == "normal") {
    //     gameDifficulty = 6;
    // } else if (difficulty == "hard") {
    //     gameDifficulty = 3;
    // }
    //==============================================

    const mainloop = () => {
        requestAnimationFrame(mainloop);
        if (!isGameOver) {
            frame++;
            if (frame < 3) return;
            frame = 0;
            ctx.clearRect(0, 0, cnv.width, cnv.height);
            player.move();
            apple.collect(player);
            ctx.fillStyle = 'black';
            ctx.fillText(apple.counter, 10, 50);
        } else {
            gameOver();
        };
    };
    requestAnimationFrame(mainloop);