'use strict';

/**
 * piece service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::piece.piece');
