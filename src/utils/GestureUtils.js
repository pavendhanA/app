const logger = require('./Logger');

class GestureUtils {
  /**
   * Helper to resolve coordinates from an element or use coordinates directly.
   */
  static async resolveCoordinates(driver, elementOrCoords) {
    if (elementOrCoords && typeof elementOrCoords.elementId !== 'undefined') {
      const rect = await elementOrCoords.getRect();
      return {
        x: Math.round(rect.x + rect.width / 2),
        y: Math.round(rect.y + rect.height / 2)
      };
    }
    return elementOrCoords; // Assume already {x, y}
  }

  /**
   * Performs a single tap at a coordinate or the center of an element.
   */
  static async tap(driver, target) {
    const coords = await this.resolveCoordinates(driver, target);
    logger.info(`Performing tap at: (${coords.x}, ${coords.y})`);
    
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: coords.x, y: coords.y },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
  }

  /**
   * Performs a double tap at a coordinate or the center of an element.
   */
  static async doubleTap(driver, target) {
    const coords = await this.resolveCoordinates(driver, target);
    logger.info(`Performing double tap at: (${coords.x}, ${coords.y})`);
    
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: coords.x, y: coords.y },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerUp', button: 0 },
        { type: 'pause', duration: 100 },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
  }

  /**
   * Performs a long press (default 1.5 seconds) on an element or coordinate.
   */
  static async longPress(driver, target, durationMs = 1500) {
    const coords = await this.resolveCoordinates(driver, target);
    logger.info(`Performing long press at: (${coords.x}, ${coords.y}) for ${durationMs}ms`);
    
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: coords.x, y: coords.y },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: durationMs },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
  }

  /**
   * Performs a drag and drop action from source to target.
   */
  static async dragAndDrop(driver, source, target) {
    const start = await this.resolveCoordinates(driver, source);
    const end = await this.resolveCoordinates(driver, target);
    logger.info(`Performing drag and drop from (${start.x}, ${start.y}) to (${end.x}, ${end.y})`);

    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: start.x, y: start.y },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 500 }, // Wait to engage drag
        { type: 'pointerMove', duration: 1000, x: end.x, y: end.y },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
  }

  /**
   * Swipes from start coordinates to end coordinates.
   */
  static async swipe(driver, startX, startY, endX, endY, durationMs = 800) {
    logger.info(`Performing swipe from (${startX}, ${startY}) to (${endX}, ${endY})`);
    
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: startX, y: startY },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerMove', duration: durationMs, x: endX, y: endY },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
  }

  /**
   * Scrolls the screen in a specified direction.
   * directions: 'up', 'down', 'left', 'right'
   */
  static async scroll(driver, direction = 'down', distanceRatio = 0.5) {
    const windowSize = await driver.getWindowRect();
    const width = windowSize.width;
    const height = windowSize.height;
    
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);
    
    let startX = centerX, startY = centerY, endX = centerX, endY = centerY;
    
    const offsetH = Math.round(height * (distanceRatio / 2));
    const offsetW = Math.round(width * (distanceRatio / 2));
    
    switch (direction.toLowerCase()) {
      case 'down':
        startY = centerY + offsetH;
        endY = centerY - offsetH;
        break;
      case 'up':
        startY = centerY - offsetH;
        endY = centerY + offsetH;
        break;
      case 'right':
        startX = centerX + offsetW;
        endX = centerX - offsetW;
        break;
      case 'left':
        startX = centerX - offsetW;
        endX = centerX + offsetW;
        break;
      default:
        throw new Error(`Invalid scroll direction: ${direction}`);
    }
    
    logger.info(`Scrolling ${direction}...`);
    await this.swipe(driver, startX, startY, endX, endY);
  }

  /**
   * Performs a pinch gesture (zoom out) using two fingers.
   */
  static async pinch(driver, targetElement = null) {
    let centerX = 500, centerY = 1000;
    if (targetElement) {
      const coords = await this.resolveCoordinates(driver, targetElement);
      centerX = coords.x;
      centerY = coords.y;
    } else {
      const size = await driver.getWindowRect();
      centerX = Math.round(size.width / 2);
      centerY = Math.round(size.height / 2);
    }
    
    logger.info(`Performing pinch (zoom out) gesture centered at (${centerX}, ${centerY})`);
    
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - 200, y: centerY - 200 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 1000, x: centerX - 20, y: centerY - 20 },
          { type: 'pointerUp', button: 0 }
        ]
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + 200, y: centerY + 200 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 1000, x: centerX + 20, y: centerY + 20 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  /**
   * Performs a zoom gesture (zoom in) using two fingers.
   */
  static async zoom(driver, targetElement = null) {
    let centerX = 500, centerY = 1000;
    if (targetElement) {
      const coords = await this.resolveCoordinates(driver, targetElement);
      centerX = coords.x;
      centerY = coords.y;
    } else {
      const size = await driver.getWindowRect();
      centerX = Math.round(size.width / 2);
      centerY = Math.round(size.height / 2);
    }
    
    logger.info(`Performing zoom (zoom in) gesture centered at (${centerX}, ${centerY})`);
    
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - 20, y: centerY - 20 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 1000, x: centerX - 200, y: centerY - 200 },
          { type: 'pointerUp', button: 0 }
        ]
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + 20, y: centerY + 20 },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 1000, x: centerX + 200, y: centerY + 200 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }
}

module.exports = GestureUtils;
