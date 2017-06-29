/* eslint-disable no-console */
/*
 * Copyright [2015-2017] Fraunhofer Gesellschaft e.V., Institute for
 * Open Communication Systems (FOKUS)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/*
 * Script for testing the server without test-framework (mocha) but console-prompt.
 */
'use strict';

import logger from "logops";
import lwm2m from "./lwm2m.js";
import config from "./config.es5.js";
import cmd from "command-node";

function start() {
    if (lwm2m.server.isRunning()) {
        logger.error("rethink-lwm2m start failed! Already running.");
        cmd.prompt();
    }
    else {
        logger.info("Starting rethink-lwm2m...");
        lwm2m.setConfig(config);
        lwm2m.start()
            .catch((error) => {
                logger.error("rethink-lwm2m start failed!", error);
                cmd.prompt();
            })
            .then(() => {
                logger.info("rethink-lwm2m started!");
                cmd.prompt();
            })
    }
}

function stop() {
    if (lwm2m.server.isRunning()) {
        logger.info("Stopping rethink-lwm2m...");
        lwm2m.stop()
            .catch((error) => {
                logger.error("rethink-lwm2m stop failed!", error);
                cmd.prompt();
            })
            .then(() => {
                logger.info("rethink-lwm2m stopped!");
                cmd.prompt();
            });
    }
    else {
        logger.error("Can't stop rethink-lwm2m! Not running.");
        cmd.prompt();
    }
}

function list() {
    lwm2m.server.listDevices((error, deviceList) => {
        if (error) {
            logger.error(error);
        }
        else if (deviceList.length > 0) {
            logger.info("\nConnected lwm2m clients:");
            deviceList.forEach((device) => {
                logger.info(device);
            });
        }
        else {
            logger.info("\nNo lwm2m clients connected");
        }
        cmd.prompt();
    });
}

function read(params) {
    lwm2m.server.read(...params, (error, result) => {
        if (error) {
            logger.info("Error while reading resource!", error);
        }
        else {
            logger.info("Read resource successfully", result);
        }
        cmd.prompt();
    })
}

function write(params) {
    lwm2m.server.write(...params, (error) => {
        if (error) {
            logger.info("Error while writing resource!", error);
        }
        else {
            logger.info("Written resource successfully!");
        }
        cmd.prompt();
    })
}

function showConfig() {
    logger.info(config);
}

function loglevel(level) {
    level = level[0].toUpperCase();
    const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];

    if (levels.indexOf(level) !== -1) {
        logger.setLevel(level);
        logger.fatal("Set log level to", level);
    }
    else {
        logger.fatal("Current level", logger.getLevel());
    }
    cmd.prompt();
}


function exit() {
    process.exit(0);
}

const commands = {
    'start': {
        parameters: [],
        description: '\tStart reTHINK-lwm2m',
        handler: start
    },
    'stop': {
        parameters: [],
        description: '\tStop reTHINK-lwm2m',
        handler: stop
    },
    'list': {
        parameters: [],
        description: '\tList connected lwm2m clients',
        handler: list
    },
    'write': {
        parameters: ['id', 'objectType', 'objectId', 'resourceId', 'value'],
        description: '\tManual lwm2m-write for development-tests',
        handler: write
    },
    'read': {
        parameters: ['id', 'objectType', 'objectId', 'resourceId'],
        description: '\tManual lwm2m-read for development-tests',
        handler: read
    },
    'config': {
        parameters: [],
        description: '\tShow current configuration',
        handler: showConfig
    },
    'loglevel': {
        parameters: ['level'],
        description: '\tView and change log level',
        handler: loglevel
    },
    'exit': {
        parameters: [],
        description: '\tExit cmd',
        handler: exit
    }
};
cmd.initialize(commands, 'reTHINK-lwm2m> ');
start();