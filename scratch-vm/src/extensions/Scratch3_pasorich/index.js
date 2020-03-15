const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

//PaSoRich Values
var pasoriDevice;
var idnum;
var gr_arr;
var readingFlag = false;
const intvalTime = 15;


 /**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGQ9Ik0yOS43ODc0IDM5LjgyQzI5LjAzMDYgMzkuODIgMTEuOTA1NCAzOS44MzMgMTEuMzIzNSAzOS44MkM5LjY5ODY4IDM5LjgyIDggMzUuODk1OSA4IDM0Ljc4NTNDOC4wMDE0NyAzNC43NTQ3IDkuMDcyNjYgNC45MTkxMSA5LjEwOTkxIDQuNjcxQzkuMTUyOTQgNC4zODQ1IDkuMjE0NjkgNC4wOTkyNSA5LjI5MTA4IDMuODE5NzJDOS40MTExNSAzLjM4MDM4IDkuNDkxODEgMy4wNTIyMiA5Ljg0NjM5IDIuNTc4MjdDMTAuMjg5NSAxLjk4NTk2IDEwLjc2MjQgMS4zMTkyNiAxMi40MzEzIDEuMzE5NkMxNS41MDMzIDEuMzIwMjQgMTQuNDA5OCAxLjI1OTE2IDE0LjgyMyAxLjI3MDMyQzE0Ljg4OTIgMS4yNzIxMSAxNC45MjY3IDEuMjY3NzkgMTQuOTE3MyAxLjE4NDY0QzE0Ljg4NzYgMC45MjQ0OTQgMTQuODYyOCAwLjY2Mzc3MSAxNC44Mzg0IDAuNDAzMDUyQzE0LjgzMDQgMC4zMTc0OTUgMTQuODI1NSAwLjIzMTI0MSAxNC44MjYxIDAuMTQ1MzUzQzE0LjgyODYgLTAuMjQwMzU3IDE0LjgzMzcgLTAuNjI2MDQ5IDE0LjgzNzcgLTEuMDExNzVDMTQuODM4IC0xLjAzOTM3IDE0LjgzNjIgLTEuMDY3MDkgMTQuODM3OSAtMS4wOTQ2MUMxNC44NDYxIC0xLjIyNTk2IDE0Ljg1NjMgLTEuMzU3MiAxNC44NjM2IC0xLjQ4ODYxQzE0Ljg3MzQgLTEuNjY0OSAxNC44NzE3IC0xLjg0MjQzIDE0Ljg5MiAtMi4wMTc0M0MxNC45Mjc5IC0yLjMyNjc1IDE0Ljk3NTYgLTIuNjM0NzMgMTUuMDIwNiAtMi45NDI5NUMxNS4wNTQgLTMuMTcyMzEgMTUuMDc5OCAtMy40MDM1OCAxNS4xMjg4IC0zLjYyOTdDMTUuMjE0OSAtNC4wMjc1MSAxNS4zMTc5IC00LjQyMTYyIDE1LjQxMDUgLTQuODE4MDZDMTUuNDkxMiAtNS4xNjM3MSAxNS41NzU5IC01LjUwODc5IDE1LjY0MjggLTUuODU3MjFDMTUuNjk5MSAtNi4xNTAxMiAxNS43MzQ0IC02LjQ0NzE5IDE1Ljc3NDkgLTYuNzQyOTdDMTUuNzk2OSAtNi45MDM1MiAxNS44MSAtNy4wNjUyOSAxNS44MjggLTcuMjI2NDFDMTUuODUzNiAtNy40NTY1NSAxNS44ODgxIC03LjY4NjA2IDE1LjkwMzUgLTcuOTE2ODZDMTUuOTE2MSAtOC4xMDYxMyAxNS44OTk3IC04LjI5NzIgMTUuOTA4NSAtOC40ODY5QzE1LjkxNjQgLTguNjU4NjYgMTUuOTU0MiAtOC44Mjk1NyAxNS45NTUyIC05LjAwMDk5QzE1Ljk1NyAtOS4zMDIwMyAxNS45NCAtOS42MDMxNyAxNS45MzI1IC05LjkwNDNDMTUuOTI5OSAtMTAuMDA1OCAxNS45Mzg5IC0xMC4xMDgxIDE1LjkzMDggLTEwLjIwOUMxNS45MDg1IC0xMC40ODU4IDE1Ljg4MDYgLTEwLjc2MjEgMTUuODUzNyAtMTEuMDM4NUMxNS44Mjg1IC0xMS4yOTc3IDE1LjgxNDYgLTExLjU1ODggMTUuNzcyOCAtMTEuODE1M0MxNS43MDU1IC0xMi4yMjg2IDE1LjYzMjMgLTEyLjY0MTkgMTUuNTM4MSAtMTMuMDQ5N0MxNS40MTQ2IC0xMy41ODM3IDE1LjI4MDkgLTE0LjExNjEgMTUuMTI3NyAtMTQuNjQyMkMxNS4wMDYyIC0xNS4wNTk0IDE0Ljg1MDYgLTE1LjQ2NjggMTQuNzA1IC0xNS44NzY3QzE0LjY4OTggLTE1LjkxOTQgMTQuNjUyMiAtMTUuOTQxMiAxNC43Mjk2IC0xNS45NDQ1QzE0Ljg1MjEgLTE1Ljk0OTcgMTQuOTc0MyAtMTUuOTYyIDE1LjA5NjcgLTE1Ljk2OTVDMTUuMjU1MiAtMTUuOTc5MiAxNS40MTM5IC0xNS45ODU1IDE1LjU3MjMgLTE1Ljk5NjNDMTUuNzYzMyAtMTYuMDA5MiAxNS43NzgxIC0xNS45OTggMTUuODAyMyAtMTUuODA5QzE1LjgwNTkgLTE1Ljc4MSAxNS44MTY4IC0xNS43NTQxIDE1LjgyMyAtMTUuNzI2M0MxNS45MDI5IC0xNS4zNjc3IDE1Ljk4NTEgLTE1LjAwOTYgMTYuMDYxNyAtMTQuNjUwM0MxNi4xNTk5IC0xNC4xODk5IDE2LjI0ODcgLTEzLjcyNzUgMTYuMzUwMiAtMTMuMjY3OUMxNi40NTc0IC0xMi43ODI1IDE2LjU3OTUgLTEyLjMwMDMgMTYuNjg2NSAtMTEuODE0OEMxNi44MTMyIC0xMS4yMzk2IDE2LjkyNzUgLTEwLjY2MTYgMTcuMDUzNSAtMTAuMDg2M0MxNy4xNDMzIC05LjY3NjMyIDE3LjI0ODMgLTkuMjY5NzEgMTcuMzM3OCAtOC44NTk2OUMxNy40NTU2IC04LjMxOTk5IDE3LjU2MzQgLTcuNzc4MDkgMTcuNjc4MiAtNy4yMzc3MkMxNy43OTc5IC02LjY3NDA0IDE3LjkyNDEgLTYuMTExNzMgMTguMDQxNSAtNS41NDc1N0MxOC4xNDE4IC01LjA2NTg2IDE4LjI0MTIgLTQuNTgzNzMgMTguMzI2OCAtNC4wOTkyOEMxOC4zOTg5IC0zLjY5MTI0IDE4LjQ1ODEgLTMuMjgwNTEgMTguNTA5MyAtMi44NjkyNUMxOC41NTQ2IC0yLjUwNDc5IDE4LjU4OTQgLTIuMTM4NTEgMTguNjEzMiAtMS43NzIwMkMxOC42MzQgLTEuNDUxMzEgMTguNjM3OCAtMS4xMjkyMiAxOC42NDA1IC0wLjgwNzY2MUMxOC42NDM4IC0wLjQzMTIwNCAxOC42NDk1IC0wLjA1NDExMzYgMTguNjMxOCAwLjMyMTY1NEMxOC42MTgzIDAuNjA5MzM2IDE4LjU3NjcgMC44OTYzNzggMTguNTMzMiAxLjE4MTVDMTguNTIxNiAxLjI1NzM3IDE4LjU0NjUgMS4yNDM2NyAxOC41OTEgMS4yNDM0MUMxOC43NzA1IDEuMjQyMzQgMTguOTUgMS4yNDA2NiAxOS4xMjk1IDEuMjQzNDFDMTkuNjEyMyAxLjI1MDgxIDI3LjI4NjMgMS4zNDE3MSAyNy43MzIyIDEuMzQ5MjFDMzAuMzc4MiAxLjM5MzY0IDMxLjA0MjkgMi41MDQyMyAzMS4zNTQyIDMuNTY0NDVDMzEuNjQyNSA0LjU0NjM2IDMxLjU3MjEgNC4zMzQxMSAzMS42MjA1IDQuNzM0ODZDMzEuNjY3IDUuMTE4OTkgMzEuNzIyOCA1LjUwMTAxIDMxLjcyMjcgNS44ODkzNUMzMS43MjI3IDYuMTAwNTMgMzIuNzM0OCAzNC42MDk0IDMyLjc0MTYgMzQuNzg1M0MzMi43NDE2IDM1Ljg5NTkgMzEuMTkwNiAzOS44MiAyOS43ODc0IDM5LjgyWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTEzLjAwMDggMjguMzkyOEMxMy4wNTQ2IDI3LjU1MTkgMTMuMzQwOCAxMC45NDYzIDEzLjQ0ODQgOC40MjM0M0MxMy41NTYxIDUuOTAwNTkgMTQuOTAxNCA2LjA1ODI3IDE2LjMwMDUgNi4wNTgyN0MxNy42OTk2IDYuMDU4MjcgMjIuNTk2NSA2LjA1ODI3IDI0LjQ4IDYuMDU4MjdDMjYuMzYzNCA2LjA1ODI3IDI3LjExNzUgNi43NzMyOSAyNy4xNzQgOC40ODNDMjcuMjMwNCAxMC4xOTI3IDI3LjYyMDQgMjcuNjA0NCAyNy41MTI4IDI4LjM5MjhDMjYuNDM2NSAyOC4zOTI4IDEzLjgwOCAyOC40NDU0IDEzLjAwMDggMjguMzkyOFoiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==';
/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGQ9Ik0yOS43ODc0IDM5LjgyQzI5LjAzMDYgMzkuODIgMTEuOTA1NCAzOS44MzMgMTEuMzIzNSAzOS44MkM5LjY5ODY4IDM5LjgyIDggMzUuODk1OSA4IDM0Ljc4NTNDOC4wMDE0NyAzNC43NTQ3IDkuMDcyNjYgNC45MTkxMSA5LjEwOTkxIDQuNjcxQzkuMTUyOTQgNC4zODQ1IDkuMjE0NjkgNC4wOTkyNSA5LjI5MTA4IDMuODE5NzJDOS40MTExNSAzLjM4MDM4IDkuNDkxODEgMy4wNTIyMiA5Ljg0NjM5IDIuNTc4MjdDMTAuMjg5NSAxLjk4NTk2IDEwLjc2MjQgMS4zMTkyNiAxMi40MzEzIDEuMzE5NkMxNS41MDMzIDEuMzIwMjQgMTQuNDA5OCAxLjI1OTE2IDE0LjgyMyAxLjI3MDMyQzE0Ljg4OTIgMS4yNzIxMSAxNC45MjY3IDEuMjY3NzkgMTQuOTE3MyAxLjE4NDY0QzE0Ljg4NzYgMC45MjQ0OTQgMTQuODYyOCAwLjY2Mzc3MSAxNC44Mzg0IDAuNDAzMDUyQzE0LjgzMDQgMC4zMTc0OTUgMTQuODI1NSAwLjIzMTI0MSAxNC44MjYxIDAuMTQ1MzUzQzE0LjgyODYgLTAuMjQwMzU3IDE0LjgzMzcgLTAuNjI2MDQ5IDE0LjgzNzcgLTEuMDExNzVDMTQuODM4IC0xLjAzOTM3IDE0LjgzNjIgLTEuMDY3MDkgMTQuODM3OSAtMS4wOTQ2MUMxNC44NDYxIC0xLjIyNTk2IDE0Ljg1NjMgLTEuMzU3MiAxNC44NjM2IC0xLjQ4ODYxQzE0Ljg3MzQgLTEuNjY0OSAxNC44NzE3IC0xLjg0MjQzIDE0Ljg5MiAtMi4wMTc0M0MxNC45Mjc5IC0yLjMyNjc1IDE0Ljk3NTYgLTIuNjM0NzMgMTUuMDIwNiAtMi45NDI5NUMxNS4wNTQgLTMuMTcyMzEgMTUuMDc5OCAtMy40MDM1OCAxNS4xMjg4IC0zLjYyOTdDMTUuMjE0OSAtNC4wMjc1MSAxNS4zMTc5IC00LjQyMTYyIDE1LjQxMDUgLTQuODE4MDZDMTUuNDkxMiAtNS4xNjM3MSAxNS41NzU5IC01LjUwODc5IDE1LjY0MjggLTUuODU3MjFDMTUuNjk5MSAtNi4xNTAxMiAxNS43MzQ0IC02LjQ0NzE5IDE1Ljc3NDkgLTYuNzQyOTdDMTUuNzk2OSAtNi45MDM1MiAxNS44MSAtNy4wNjUyOSAxNS44MjggLTcuMjI2NDFDMTUuODUzNiAtNy40NTY1NSAxNS44ODgxIC03LjY4NjA2IDE1LjkwMzUgLTcuOTE2ODZDMTUuOTE2MSAtOC4xMDYxMyAxNS44OTk3IC04LjI5NzIgMTUuOTA4NSAtOC40ODY5QzE1LjkxNjQgLTguNjU4NjYgMTUuOTU0MiAtOC44Mjk1NyAxNS45NTUyIC05LjAwMDk5QzE1Ljk1NyAtOS4zMDIwMyAxNS45NCAtOS42MDMxNyAxNS45MzI1IC05LjkwNDNDMTUuOTI5OSAtMTAuMDA1OCAxNS45Mzg5IC0xMC4xMDgxIDE1LjkzMDggLTEwLjIwOUMxNS45MDg1IC0xMC40ODU4IDE1Ljg4MDYgLTEwLjc2MjEgMTUuODUzNyAtMTEuMDM4NUMxNS44Mjg1IC0xMS4yOTc3IDE1LjgxNDYgLTExLjU1ODggMTUuNzcyOCAtMTEuODE1M0MxNS43MDU1IC0xMi4yMjg2IDE1LjYzMjMgLTEyLjY0MTkgMTUuNTM4MSAtMTMuMDQ5N0MxNS40MTQ2IC0xMy41ODM3IDE1LjI4MDkgLTE0LjExNjEgMTUuMTI3NyAtMTQuNjQyMkMxNS4wMDYyIC0xNS4wNTk0IDE0Ljg1MDYgLTE1LjQ2NjggMTQuNzA1IC0xNS44NzY3QzE0LjY4OTggLTE1LjkxOTQgMTQuNjUyMiAtMTUuOTQxMiAxNC43Mjk2IC0xNS45NDQ1QzE0Ljg1MjEgLTE1Ljk0OTcgMTQuOTc0MyAtMTUuOTYyIDE1LjA5NjcgLTE1Ljk2OTVDMTUuMjU1MiAtMTUuOTc5MiAxNS40MTM5IC0xNS45ODU1IDE1LjU3MjMgLTE1Ljk5NjNDMTUuNzYzMyAtMTYuMDA5MiAxNS43NzgxIC0xNS45OTggMTUuODAyMyAtMTUuODA5QzE1LjgwNTkgLTE1Ljc4MSAxNS44MTY4IC0xNS43NTQxIDE1LjgyMyAtMTUuNzI2M0MxNS45MDI5IC0xNS4zNjc3IDE1Ljk4NTEgLTE1LjAwOTYgMTYuMDYxNyAtMTQuNjUwM0MxNi4xNTk5IC0xNC4xODk5IDE2LjI0ODcgLTEzLjcyNzUgMTYuMzUwMiAtMTMuMjY3OUMxNi40NTc0IC0xMi43ODI1IDE2LjU3OTUgLTEyLjMwMDMgMTYuNjg2NSAtMTEuODE0OEMxNi44MTMyIC0xMS4yMzk2IDE2LjkyNzUgLTEwLjY2MTYgMTcuMDUzNSAtMTAuMDg2M0MxNy4xNDMzIC05LjY3NjMyIDE3LjI0ODMgLTkuMjY5NzEgMTcuMzM3OCAtOC44NTk2OUMxNy40NTU2IC04LjMxOTk5IDE3LjU2MzQgLTcuNzc4MDkgMTcuNjc4MiAtNy4yMzc3MkMxNy43OTc5IC02LjY3NDA0IDE3LjkyNDEgLTYuMTExNzMgMTguMDQxNSAtNS41NDc1N0MxOC4xNDE4IC01LjA2NTg2IDE4LjI0MTIgLTQuNTgzNzMgMTguMzI2OCAtNC4wOTkyOEMxOC4zOTg5IC0zLjY5MTI0IDE4LjQ1ODEgLTMuMjgwNTEgMTguNTA5MyAtMi44NjkyNUMxOC41NTQ2IC0yLjUwNDc5IDE4LjU4OTQgLTIuMTM4NTEgMTguNjEzMiAtMS43NzIwMkMxOC42MzQgLTEuNDUxMzEgMTguNjM3OCAtMS4xMjkyMiAxOC42NDA1IC0wLjgwNzY2MUMxOC42NDM4IC0wLjQzMTIwNCAxOC42NDk1IC0wLjA1NDExMzYgMTguNjMxOCAwLjMyMTY1NEMxOC42MTgzIDAuNjA5MzM2IDE4LjU3NjcgMC44OTYzNzggMTguNTMzMiAxLjE4MTVDMTguNTIxNiAxLjI1NzM3IDE4LjU0NjUgMS4yNDM2NyAxOC41OTEgMS4yNDM0MUMxOC43NzA1IDEuMjQyMzQgMTguOTUgMS4yNDA2NiAxOS4xMjk1IDEuMjQzNDFDMTkuNjEyMyAxLjI1MDgxIDI3LjI4NjMgMS4zNDE3MSAyNy43MzIyIDEuMzQ5MjFDMzAuMzc4MiAxLjM5MzY0IDMxLjA0MjkgMi41MDQyMyAzMS4zNTQyIDMuNTY0NDVDMzEuNjQyNSA0LjU0NjM2IDMxLjU3MjEgNC4zMzQxMSAzMS42MjA1IDQuNzM0ODZDMzEuNjY3IDUuMTE4OTkgMzEuNzIyOCA1LjUwMTAxIDMxLjcyMjcgNS44ODkzNUMzMS43MjI3IDYuMTAwNTMgMzIuNzM0OCAzNC42MDk0IDMyLjc0MTYgMzQuNzg1M0MzMi43NDE2IDM1Ljg5NTkgMzEuMTkwNiAzOS44MiAyOS43ODc0IDM5LjgyWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTEzLjAwMDggMjguMzkyOEMxMy4wNTQ2IDI3LjU1MTkgMTMuMzQwOCAxMC45NDYzIDEzLjQ0ODQgOC40MjM0M0MxMy41NTYxIDUuOTAwNTkgMTQuOTAxNCA2LjA1ODI3IDE2LjMwMDUgNi4wNTgyN0MxNy42OTk2IDYuMDU4MjcgMjIuNTk2NSA2LjA1ODI3IDI0LjQ4IDYuMDU4MjdDMjYuMzYzNCA2LjA1ODI3IDI3LjExNzUgNi43NzMyOSAyNy4xNzQgOC40ODNDMjcuMjMwNCAxMC4xOTI3IDI3LjYyMDQgMjcuNjA0NCAyNy41MTI4IDI4LjM5MjhDMjYuNDM2NSAyOC4zOTI4IDEzLjgwOCAyOC40NDU0IDEzLjAwMDggMjguMzkyOFoiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==';



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