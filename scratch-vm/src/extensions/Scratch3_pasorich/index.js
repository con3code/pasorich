const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

//PaSoRich Values
var pasoriDevice;
var idnum;
var gr_arr;
var readingFlag = false;
const intvalTime = 14;


 /**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSI+CiA8IS0tIEdlbmVyYXRlZCBieSBQaXhlbG1hdG9yIFBybyAxLjMuNCAtLT4KIDxwYXRoIGlkPSJwYXRoIiBkPSJNNi4xMSAzNC45ODQgQzYuMTEgMzYuMTg0IDYuOTc0IDM3LjI0IDguNzk4IDM3LjI0IDExLjc3NCAzNy4yNCAxMi40OTQgMzYuNjE2IDEyLjQ5NCAzNC45ODQgMTIuNDk0IDM0LjUwNCAxMi4xNTggMzQuMDI0IDExLjk2NiAzMy42ODggTDExLjk2NiAyNS4zMzYgQzI0LjI1NCAyMy45NDQgMzYuODMgMTguMzI4IDM2LjgzIDExLjUxMiAzNi44MyA3LjgxNiAzNC4wNDYgNi4wODggMjguMTQyIDYuMDg4IDIwLjc5OCA2LjA4OCAxNC43NSA4LjUzNiAxMS45MTggOS42ODggTDExLjkxOCA5LjAxNiBDMTIuMzk4IDcuNDMyIDExLjM5IDYuMjggOS4xMzQgNi4yOCA4LjEyNiA2LjI4IDYuMzUgNy4xOTIgNi4zNSA4LjYzMiA2LjM1IDkuMTEyIDYuNDk0IDkuNTkyIDYuNjM4IDkuODggTDYuNjM4IDExLjUxMiBDNS44MjIgMTEuOTQ0IDUuMjQ2IDEyLjc2IDUuMjQ2IDE0LjI5NiA1LjI0NiAxNS40OTYgNS44MjIgMTYuMjY0IDYuNjM4IDE2LjQwOCBMNi42MzggMzMuMzA0IEM2LjI1NCAzMy44OCA2LjExIDM0LjI2NCA2LjExIDM0Ljk4NCBaIE0xMS45NjYgMTQuMTA0IEMxNi43NjYgMTEuODk2IDIyLjI4NiAxMC41MDQgMjYuNTU4IDEwLjUwNCAyOS43NzQgMTAuNTA0IDMxLjI2MiAxMS4yMjQgMzEuMjYyIDEyLjU2OCAzMS4yNjIgMTUuNzM2IDIyLjMzNCAxOS45MTIgMTEuOTY2IDIxLjExMiBaIiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjEiIHN0cm9rZT0ibm9uZSIvPgo8L3N2Zz4K';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSI+CiA8IS0tIEdlbmVyYXRlZCBieSBQaXhlbG1hdG9yIFBybyAxLjMuNCAtLT4KIDxwYXRoIGlkPSJwYXRoIiBkPSJNNi4xMSAzNC45ODQgQzYuMTEgMzYuMTg0IDYuOTc0IDM3LjI0IDguNzk4IDM3LjI0IDExLjc3NCAzNy4yNCAxMi40OTQgMzYuNjE2IDEyLjQ5NCAzNC45ODQgMTIuNDk0IDM0LjUwNCAxMi4xNTggMzQuMDI0IDExLjk2NiAzMy42ODggTDExLjk2NiAyNS4zMzYgQzI0LjI1NCAyMy45NDQgMzYuODMgMTguMzI4IDM2LjgzIDExLjUxMiAzNi44MyA3LjgxNiAzNC4wNDYgNi4wODggMjguMTQyIDYuMDg4IDIwLjc5OCA2LjA4OCAxNC43NSA4LjUzNiAxMS45MTggOS42ODggTDExLjkxOCA5LjAxNiBDMTIuMzk4IDcuNDMyIDExLjM5IDYuMjggOS4xMzQgNi4yOCA4LjEyNiA2LjI4IDYuMzUgNy4xOTIgNi4zNSA4LjYzMiA2LjM1IDkuMTEyIDYuNDk0IDkuNTkyIDYuNjM4IDkuODggTDYuNjM4IDExLjUxMiBDNS44MjIgMTEuOTQ0IDUuMjQ2IDEyLjc2IDUuMjQ2IDE0LjI5NiA1LjI0NiAxNS40OTYgNS44MjIgMTYuMjY0IDYuNjM4IDE2LjQwOCBMNi42MzggMzMuMzA0IEM2LjI1NCAzMy44OCA2LjExIDM0LjI2NCA2LjExIDM0Ljk4NCBaIE0xMS45NjYgMTQuMTA0IEMxNi43NjYgMTEuODk2IDIyLjI4NiAxMC41MDQgMjYuNTU4IDEwLjUwNCAyOS43NzQgMTAuNTA0IDMxLjI2MiAxMS4yMjQgMzEuMjYyIDEyLjU2OCAzMS4yNjIgMTUuNzM2IDIyLjMzNCAxOS45MTIgMTEuOTY2IDIxLjExMiBaIiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjEiIHN0cm9rZT0ibm9uZSIvPgo8L3N2Zz4K';



function sleep(msec) {
    return new Promise(resolve => 
        setTimeout(() => {
            resolve();
        }, msec)
    );
}

function send(s_device, data) {
        let uint8a = new Uint8Array(data);
//        console.log("snd -> ");
        s_device.transferOut(2, uint8a)
        .then()
        .catch();
}


function receive(r_device, len, cpy) {
//    console.log("rcv <- " + len);
    r_device.transferIn(1, len)
    .then(result => {
            let arr = [];
            for (let i = result.data.byteOffset; i < result.data.byteLength; i++) {
                arr.push(result.data.getUint8(i));
            }
            if(cpy){
                gr_arr = JSON.parse(JSON.stringify(arr));
//                console.log("gr_arr:" + gr_arr);
            }
            return arr;
    });
}



function session(ss_device) {
//    console.log("=== S:session ===");
//    console.log("ss_device:");
//    console.log(ss_device);


    sleep(38).then(() => {
        send(ss_device, [0x00, 0x00, 0xff, 0x00, 0xff, 0x00], false);
        return sleep(intvalTime);
    })
    .then(() => {
            send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x03, 0x00, 0xfd, 0xd6, 0x2a, 0x01, 0xff, 0x00], false);
            return sleep(intvalTime);
        })
    .then(() => {
        receive(ss_device, 6, false);
        return sleep(intvalTime);
    })
    .then(() => {
            receive(ss_device, 13, false);
            return sleep(intvalTime);
        })
    .then(() => {
            send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x03, 0x00, 0xfd, 0xd6, 0x06, 0x00, 0x24, 0x00], false);
            return sleep(intvalTime);
        })
    .then(() => {
            receive(ss_device, 6, false);
            return sleep(intvalTime);
        })
    .then(() => {
            receive(ss_device, 13, false);
            return sleep(intvalTime);
        })
    .then(() => {
            send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x03, 0x00, 0xfd, 0xd6, 0x06, 0x00, 0x24, 0x00], false);
            return sleep(intvalTime);
        })
    .then(() => {
            receive(ss_device, 6, false);
            return sleep(intvalTime);
        })
    .then(() => {
            receive(ss_device, 13, false);
            return sleep(intvalTime);
        })
    .then(() => {
            send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x06, 0x00, 0xfa, 0xd6, 0x00, 0x01, 0x01, 0x0f, 0x01, 0x18, 0x00], false);
            return sleep(intvalTime);
        })
    .then(() => {
            receive(ss_device, 6, false);
            return sleep(intvalTime);
        })
    .then(() => {
            receive(ss_device, 13, false);
            return sleep(intvalTime);
        })
    .then(() => {
            send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x28, 0x00, 0xd8, 0xd6, 0x02, 0x00, 0x18, 0x01, 0x01, 0x02, 0x01, 0x03, 0x00, 0x04, 0x00, 0x05, 0x00, 0x06, 0x00, 0x07, 0x08, 0x08, 0x00, 0x09, 0x00, 0x0a, 0x00, 0x0b, 0x00, 0x0c, 0x00, 0x0e, 0x04, 0x0f, 0x00, 0x10, 0x00, 0x11, 0x00, 0x12, 0x00, 0x13, 0x06, 0x4b, 0x00], false);
            return sleep(intvalTime);
        })
    .then(() => {
            receive(ss_device, 6, false);
            return sleep(intvalTime);
        })
    .then(() => {
            receive(ss_device, 13, false);
            return sleep(intvalTime);
        })
    .then(() => {
            send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x04, 0x00, 0xfc, 0xd6, 0x02, 0x00, 0x18, 0x10, 0x00], false);
            return sleep(intvalTime);
        })
    .then(() => {
            receive(ss_device, 6, false);
            return sleep(intvalTime);
        })
    .then(() => {
            receive(ss_device, 13, false);
            return sleep(intvalTime);
        })
    .then(() => {
            send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x0a, 0x00, 0xf6, 0xd6, 0x04, 0x6e, 0x00, 0x06, 0x00, 0xff, 0xff, 0x01, 0x00, 0xb3, 0x00], false);
            return sleep(intvalTime);
        })
    .then(() => {
            receive(ss_device, 6, false);
            return sleep(intvalTime);
        })
    .then(() => {
        receive(ss_device, 37, true);
        return sleep(intvalTime);
    })
    .then(() => {
	    
//	    console.log(gr_arr);
	    
	    if (gr_arr != undefined){
	        if (gr_arr.length > 25){
	            
	            let idm = gr_arr.slice(17, 25);
				if (idm.length > 0) {
            	    let idmStr = '';
					for (let i = 0; i < idm.length; i++) {
                	    if (idm[i] < 16) {
                	        idmStr += '0';
						}
						idmStr += idm[i].toString(16);
					}
					console.log("Idm: " + idmStr);
					idnum = JSON.parse(JSON.stringify(idmStr));
            	}
            	
        	}else {
				idnum = '';
        	}
        	
	    } else {
				idnum = '';		    
	    }

    })
    .catch((err) => {
	    console.log(err);
	})
	.finally(() => {
		setTimeout(() => {
            readingFlag = false;
        },8);		
	})
    ;


//    console.log("=== E:session ===");

}


/**
 * Class for the PaSoRich - PaSoRi with Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3Pasorich {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

//        console.log("initializing...");
        if (pasoriDevice != null) {
            pasoriDevice.close();
            pasoriDevice = null;
        }

		console.log(navigator);
//		console.log(navigator.usb);
 
        navigator.usb.requestDevice({ filters: [{ vendorId: 0x054c }] })
        .then(selectedDevice => {
            pasoriDevice = selectedDevice;
            return pasoriDevice.open();
        })
        .then(() => 
            pasoriDevice.selectConfiguration(1)
        )
        .then(() => 
            pasoriDevice.claimInterface(0)
        )
		.then(() =>
			session(pasoriDevice)
		)
        ;
        
//        console.log("init_done");
    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'pasorich',
            name: 'PaSoRich',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'readPasori',
                    text: 'read PaSoRi',
                    blockType: BlockType.COMMAND,
                    text: 'read PaSoRi'
                },
                {
                    opcode: 'getIdm',
                    text: 'Idm',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'resetIdm',
                    text: 'reset Idm',
                    blockType: BlockType.COMMAND,
                    text: 'reset Idm'
                },
                {
                    opcode: 'getReadingFlag',
                    text: 'reading',
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'getWaitingFlag',
                    text: 'waiting',
                    blockType: BlockType.BOOLEAN
                }
/**
                ,
                {
                    opcode: 'openPasori',
                    text: 'open PaSoRi',
                    blockType: BlockType.COMMAND,
                    text: 'open PaSoRi'
                }
                ,
                {
                    opcode: 'closePasori',
                    text: 'close PaSoRi',
                    blockType: BlockType.COMMAND,
                    text: 'close PaSoRi'
                }
*/
            ],
            menus: {
            }
        };
    }




    readPasori () {
//        console.log('=== S:readPaSoRi ===');

        if(readingFlag){return;}
        readingFlag = true;

		idnum = '';

        if(pasoriDevice.opened){
            pasoriDevice.close();
        }

        navigator.usb.getDevices().then(devices => {
//            console.log(devices);
            devices.map(selectedDevice => {
                pasoriDevice = selectedDevice;
                pasoriDevice.open()
                .then(() => 
                    pasoriDevice.selectConfiguration(1)
                )
                .then(() => 
                    pasoriDevice.claimInterface(0)
                )
                .then(() =>
					session(pasoriDevice)
                )
                ;
            });
//            session(pasoriDevice);
        })
        .catch(error => { console.log(error); });

//        console.log('=== E:readPaSoRi ===');
    }



    getIdm () {
//		console.log('=== S:getIdm ===');
        return idnum;
    }

	resetIdm () {
		idnum = '';
        return;
    }

    getReadingFlag () {
        return readingFlag;
    }

	getWaitingFlag () {
        return !readingFlag;
    }
    
    
    openPasori () {
//        console.log('=== S:openPaSoRi ===');
        
        if(readingFlag){return;}

        if (pasoriDevice != null) {
            pasoriDevice.close();
            pasoriDevice = null;
        }


        navigator.usb.requestDevice({ filters: [{ vendorId: 0x054c }] })
        .then(selectedDevice => {
            pasoriDevice = selectedDevice;
            return pasoriDevice.open();
        })
        .then(() => 
            pasoriDevice.selectConfiguration(1)
        )
        .then(() => 
            pasoriDevice.claimInterface(0)
        )
        .catch(error => { console.log(error); });

/**
        navigator.usb.getDevices().then(devices => {
            console.log(devices);
            devices.map(selectedDevice => {
                pasoriDevice = selectedDevice;
                pasoriDevice.open()
                .then(() => 
                    pasoriDevice.selectConfiguration(1)
                )
                .then(() => 
                    pasoriDevice.claimInterface(0)
                );
            });
        })
        .catch(error => { console.log(error); });
*/

//        console.log('=== E:openPaSoRi ===');
    }


    closePasori () {
        if(readingFlag){return;}
        return pasoriDevice.close();
    }


}
module.exports = Scratch3Pasorich;