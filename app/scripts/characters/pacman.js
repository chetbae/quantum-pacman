class Pacman {
  constructor(scaledTileSize, mazeArray, characterUtil) {
    this.scaledTileSize = scaledTileSize;
    this.mazeArray = mazeArray;
    this.characterUtil = characterUtil;
    this.animationTarget = document.getElementById("pacman");
    this.pacmanArrow = document.getElementById("pacman-arrow");

    this.flashElement = document.getElementById("pacman-flash");
    this.flashElement.style.visibility = "hidden";
    this.flashElement.style.backgroundImage =
      "url(app/style/graphics/spriteSheets/characters/pacman/flash.svg)";
    this.flashElement.style.position = "absolute";

    // Flash ability, triggered by 10 dots
    this.flashActive = false;

    // Flash Radius in Grid Position
    this.flashRadius = 8;

    // Add a listener for 'activateFlash'
    window.addEventListener("activateFlash", () => {
      this.activateFlash();
    });

    this.reset();
  }
  // Adjust flash radius at setStyleMeasurements()

  /**
   * Activate flash function
   */
  activateFlash() {
    this.flashActive = true;
    this.flashElement.style.visibility = "visible";

    // Center the flash element on Pacman's centerconst flashSize = this.flashElement.offsetWidth;
    const flashSize = this.flashElement.offsetWidth;
    const offset = flashSize / 2;
    const verticalAdjustment = this.measurement / 3; // Adjust this value to move flash up/down
    this.flashElement.style.top = `${
      this.position.top + this.measurement / 2 - offset - verticalAdjustment
    }px`;
    this.flashElement.style.left = `${this.position.left + this.measurement / 2 - offset}px`;

    setTimeout(() => {
      this.flashActive = false;
      this.flashElement.style.visibility = "hidden";
    }, 750);
  }

  /**
   * Rests the character to its default state
   */
  reset() {
    this.setMovementStats(this.scaledTileSize);
    this.setSpriteAnimationStats();
    this.setStyleMeasurements(this.scaledTileSize, this.spriteFrames);
    this.setDefaultPosition(this.scaledTileSize);
    this.setSpriteSheet(this.direction);
    this.pacmanArrow.style.backgroundImage =
      "url(app/style/graphics/" + `spriteSheets/characters/pacman/arrow_${this.direction}.svg)`;
  }

  /**
   * Sets various properties related to Pacman's movement
   * @param {number} scaledTileSize - The dimensions of a single tile
   */
  setMovementStats(scaledTileSize) {
    this.velocityPerMs = this.calculateVelocityPerMs(scaledTileSize);
    this.desiredDirection = this.characterUtil.directions.left;
    this.direction = this.characterUtil.directions.left;
    this.moving = false;
  }

  /**
   * Sets values pertaining to Pacman's spritesheet animation
   */
  setSpriteAnimationStats() {
    this.specialAnimation = false;
    this.display = true;
    this.animate = true;
    this.loopAnimation = true;
    this.msBetweenSprites = 50;
    this.msSinceLastSprite = 0;
    this.spriteFrames = 4;
    this.backgroundOffsetPixels = 0;
    this.animationTarget.style.backgroundPosition = "0px 0px";
  }

  /**
   * Sets css property values for Pacman and Pacman's Arrow
   * @param {number} scaledTileSize - The dimensions of a single tile
   * @param {number} spriteFrames - The number of frames in Pacman's spritesheet
   */
  setStyleMeasurements(scaledTileSize, spriteFrames) {
    this.measurement = scaledTileSize * 2;

    this.animationTarget.style.height = `${this.measurement}px`;
    this.animationTarget.style.width = `${this.measurement}px`;
    this.animationTarget.style.backgroundSize = `${this.measurement * spriteFrames}px`;

    this.pacmanArrow.style.height = `${this.measurement * 2}px`;
    this.pacmanArrow.style.width = `${this.measurement * 2}px`;
    this.pacmanArrow.style.backgroundSize = `${this.measurement * 2}px`;

    // Add flash element measurements (3x larger than Pacman)
    const flashSize = this.measurement * 10;
    this.flashElement.style.height = `${flashSize}px`;
    this.flashElement.style.width = `${flashSize}px`;
    this.flashElement.style.backgroundSize = "100%";
  }

  /**
   * Sets the default position and direction for Pacman at the game's start
   * @param {number} scaledTileSize - The dimensions of a single tile
   */
  setDefaultPosition(scaledTileSize) {
    this.defaultPosition = {
      top: scaledTileSize * 22.5,
      left: scaledTileSize * 13,
    };
    this.position = Object.assign({}, this.defaultPosition);
    this.oldPosition = Object.assign({}, this.position);
    this.animationTarget.style.top = `${this.position.top}px`;
    this.animationTarget.style.left = `${this.position.left}px`;
  }

  /**
   * Calculates how fast Pacman should move in a millisecond
   * @param {number} scaledTileSize - The dimensions of a single tile
   */
  calculateVelocityPerMs(scaledTileSize) {
    // In the original game, Pacman moved at 11 tiles per second.
    const velocityPerSecond = scaledTileSize * 6;
    return velocityPerSecond / 1000;
  }

  /**
   * Chooses a movement Spritesheet depending upon direction
   * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
   */
  setSpriteSheet(direction) {
    this.animationTarget.style.backgroundImage =
      "url(app/style/graphics/" + `spriteSheets/characters/pacman/pacman_${direction}.svg)`;
  }

  prepDeathAnimation() {
    this.loopAnimation = false;
    this.msBetweenSprites = 125;
    this.spriteFrames = 12;
    this.specialAnimation = true;
    this.backgroundOffsetPixels = 0;
    const bgSize = this.measurement * this.spriteFrames;
    this.animationTarget.style.backgroundSize = `${bgSize}px`;
    this.animationTarget.style.backgroundImage =
      "url(app/style/" + "graphics/spriteSheets/characters/pacman/pacman_death.svg)";
    this.animationTarget.style.backgroundPosition = "0px 0px";
    this.pacmanArrow.style.backgroundImage = "";
  }

  /**
   * Changes Pacman's desiredDirection, updates the PacmanArrow sprite, and sets moving to true
   * @param {Event} e - The keydown event to evaluate
   * @param {Boolean} startMoving - If true, Pacman will move upon key press
   */
  changeDirection(newDirection, startMoving) {
    this.desiredDirection = newDirection;
    this.pacmanArrow.style.backgroundImage =
      "url(app/style/graphics/" +
      `spriteSheets/characters/pacman/arrow_${this.desiredDirection}.svg)`;

    if (startMoving) {
      this.moving = true;
    }
  }

  /**
   * Updates the position of the leading arrow in front of Pacman
   * @param {({top: number, left: number})} position - Pacman's position during the current frame
   * @param {number} scaledTileSize - The dimensions of a single tile
   */
  updatePacmanArrowPosition(position, scaledTileSize) {
    this.pacmanArrow.style.top = `${position.top - scaledTileSize}px`;
    this.pacmanArrow.style.left = `${position.left - scaledTileSize}px`;
  }

  /**
   * Handle Pacman's movement when he is snapped to the x-y grid of the Maze Array
   * @param {number} elapsedMs - The amount of MS that have passed since the last update
   * @returns {({ top: number, left: number})}
   */
  handleSnappedMovement(elapsedMs) {
    const desired = this.characterUtil.determineNewPositions(
      this.position,
      this.desiredDirection,
      this.velocityPerMs,
      elapsedMs,
      this.scaledTileSize
    );
    const alternate = this.characterUtil.determineNewPositions(
      this.position,
      this.direction,
      this.velocityPerMs,
      elapsedMs,
      this.scaledTileSize
    );

    if (
      this.characterUtil.checkForWallCollision(
        desired.newGridPosition,
        this.mazeArray,
        this.desiredDirection
      )
    ) {
      if (
        this.characterUtil.checkForWallCollision(
          alternate.newGridPosition,
          this.mazeArray,
          this.direction
        )
      ) {
        this.moving = false;
        return this.position;
      }
      return alternate.newPosition;
    }
    this.direction = this.desiredDirection;
    this.setSpriteSheet(this.direction);
    return desired.newPosition;
  }

  /**
   * Handle Pacman's movement when he is inbetween tiles on the x-y grid of the Maze Array
   * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
   * @param {number} elapsedMs - The amount of MS that have passed since the last update
   * @returns {({ top: number, left: number})}
   */
  handleUnsnappedMovement(gridPosition, elapsedMs) {
    const desired = this.characterUtil.determineNewPositions(
      this.position,
      this.desiredDirection,
      this.velocityPerMs,
      elapsedMs,
      this.scaledTileSize
    );
    const alternate = this.characterUtil.determineNewPositions(
      this.position,
      this.direction,
      this.velocityPerMs,
      elapsedMs,
      this.scaledTileSize
    );

    if (this.characterUtil.turningAround(this.direction, this.desiredDirection)) {
      this.direction = this.desiredDirection;
      this.setSpriteSheet(this.direction);
      return desired.newPosition;
    }
    if (this.characterUtil.changingGridPosition(gridPosition, alternate.newGridPosition)) {
      return this.characterUtil.snapToGrid(gridPosition, this.direction, this.scaledTileSize);
    }
    return alternate.newPosition;
  }

  /**
   * Updates the css position, hides if there is a stutter, and animates the spritesheet
   * @param {number} interp - The animation accuracy as a percentage
   */
  draw(interp) {
    const newTop = this.characterUtil.calculateNewDrawValue(
      interp,
      "top",
      this.oldPosition,
      this.position
    );
    const newLeft = this.characterUtil.calculateNewDrawValue(
      interp,
      "left",
      this.oldPosition,
      this.position
    );

    // Update Pacman position
    this.animationTarget.style.top = `${newTop}px`;
    this.animationTarget.style.left = `${newLeft}px`;

    // Update flash position if active
    if (this.flashActive) {
      const flashSize = this.flashElement.offsetWidth;
      const offset = flashSize / 2;
      const verticalAdjustment = this.measurement / 3; // Same adjustment as in activateFlash
      this.flashElement.style.top = `${
        newTop + this.measurement / 2 - offset - verticalAdjustment
      }px`;
      this.flashElement.style.left = `${newLeft + this.measurement / 2 - offset}px`;
    }

    this.animationTarget.style.visibility = this.display
      ? this.characterUtil.checkForStutter(this.position, this.oldPosition)
      : "hidden";
    this.pacmanArrow.style.visibility = this.animationTarget.style.visibility;

    this.updatePacmanArrowPosition(this.position, this.scaledTileSize);

    const updatedProperties = this.characterUtil.advanceSpriteSheet(this);
    this.msSinceLastSprite = updatedProperties.msSinceLastSprite;
    this.animationTarget = updatedProperties.animationTarget;
    this.backgroundOffsetPixels = updatedProperties.backgroundOffsetPixels;
  }

  /**
   * Handles movement logic for Pacman
   * @param {number} elapsedMs - The amount of MS that have passed since the last update
   */
  update(elapsedMs) {
    this.oldPosition = Object.assign({}, this.position);

    if (this.moving) {
      const gridPosition = this.characterUtil.determineGridPosition(
        this.position,
        this.scaledTileSize
      );

      if (
        JSON.stringify(this.position) ===
        JSON.stringify(
          this.characterUtil.snapToGrid(gridPosition, this.direction, this.scaledTileSize)
        )
      ) {
        this.position = this.handleSnappedMovement(elapsedMs);
      } else {
        this.position = this.handleUnsnappedMovement(gridPosition, elapsedMs);
      }

      this.position = this.characterUtil.handleWarp(
        this.position,
        this.scaledTileSize,
        this.mazeArray
      );
    }

    if (this.moving || this.specialAnimation) {
      this.msSinceLastSprite += elapsedMs;
    }
  }
}

// removeIf(production)
module.exports = Pacman;
// endRemoveIf(production)
