class Particle {

    constructor(particleRadius, x, y, speed, turningAngle, neighborhoodAngle, neighborRadius) {
        this.particleRadius = particleRadius;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.turningAngle = turningAngle;
        this.neighborhoodAngle = neighborhoodAngle;
        this.neighborRadius = neighborRadius;

        this.orientation = 0;
    }

    update(particleArray) {
        this.findNeighbors(particleArray);
        this.categorizeNeighborsBySide();
        this.updateOrientation();

        let angleMovement = degreesToRadians(this.orientation);
        this.x += this.speed*Math.cos(angleMovement);
        this.y += this.speed*Math.sin(angleMovement);
        this.checkBoundaries();
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.particleRadius, 0, 2*Math.PI)
        context.lineWidth = 2;
        context.stroke();
        context.fillStyle = getColorForNeighborhoodSize(this.neighbors.length);
        context.fill();
    }

    updateOrientation() {
        this.orientation += this.turningAngle +
            this.neighborhoodAngle * this.neighbors.length *
            Math.sign(this.rightNeighbors-this.leftNeighbors);
    }

    findNeighbors(particleArray) {
        this.neighbors = [];
        let distance;
        for (let i = 0; i < particleArray.length; i++) {
            distance = Math.sqrt(
                Math.pow(particleArray[i].x - this.x,2)
                + Math.pow(particleArray[i].y - this.y,2));
            if (distance <= this.neighborRadius)
                this.neighbors.push(particleArray[i]);
        }
    }

    categorizeNeighborsBySide() {
        this.leftNeighbors = 0, this.rightNeighbors = 0;
        let m = this.speed * Math.sin(degreesToRadians(this.orientation));
        let dividingLine = (x) => m*(x-this.x) - this.y;

        for (let i = 0; i < this.neighbors.length; i++) {
            if (this.neighbors[i].y < dividingLine(this.neighbors[i].x))
                this.leftNeighbors++;
            else
                this.rightNeighbors++;
        }
    }

    checkBoundaries() {
        if (this.orientation >= 360)
            this.orientation -= 360;
        if (this.x > canvasWidth)
            this.x -= canvasWidth;
        if (this.x < 0)
            this.x = canvasWidth;
        if (this.y > canvasHeight)
            this.y -= canvasHeight
        if (this.y < 0)
            this.y = canvasHeight;
    }
}