/*
    SC2Scratch for PaSoRi (PaSoRich)
    Scratch3.0 Extension to read SmartCard (Felica) by SONY RC-S380 (PaSoRi)

    Web:
    https://con3.com/sc2scratch/

*/

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');

// Variables
var pasoriDevice;
var idnum;
var idnum_sha256;
var gr_arr;
var readingFlag = false;
var inoutFlag = false;
var connectingCount = 0;
var isConnect = formatMessage({
    id: 'pasorich.push2Connect',
    default: 'Push to Connect.',
    description: 'push2Connect'
});
const intvalTime_short = 12;
const PaSoRichVersion = "PaSoRich 0.6.6";


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
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGQ9Ik0yOS43ODc0IDM5LjgyQzI5LjAzMDYgMzkuODIgMTEuOTA1NCAzOS44MzMgMTEuMzIzNSAzOS44MkM5LjY5ODY4IDM5LjgyIDggMzUuODk1OSA4IDM0Ljc4NTNDOC4wMDE0NyAzNC43NTQ3IDkuMDcyNjYgNC45MTkxMSA5LjEwOTkxIDQuNjcxQzkuMTUyOTQgNC4zODQ1IDkuMjE0NjkgNC4wOTkyNSA5LjI5MTA4IDMuODE5NzJDOS40MTExNSAzLjM4MDM4IDkuNDkxODEgMy4wNTIyMiA5Ljg0NjM5IDIuNTc4MjdDMTAuMjg5NSAxLjk4NTk2IDEwLjc2MjQgMS4zMTkyNiAxMi40MzEzIDEuMzE5NkMxNS41MDMzIDEuMzIwMjQgMTQuNDA5OCAxLjI1OTE2IDE0LjgyMyAxLjI3MDMyQzE0Ljg4OTIgMS4yNzIxMSAxNC45MjY3IDEuMjY3NzkgMTQuOTE3MyAxLjE4NDY0QzE0Ljg4NzYgMC45MjQ0OTQgMTQuODYyOCAwLjY2Mzc3MSAxNC44Mzg0IDAuNDAzMDUyQzE0LjgzMDQgMC4zMTc0OTUgMTQuODI1NSAwLjIzMTI0MSAxNC44MjYxIDAuMTQ1MzUzQzE0LjgyODYgLTAuMjQwMzU3IDE0LjgzMzcgLTAuNjI2MDQ5IDE0LjgzNzcgLTEuMDExNzVDMTQuODM4IC0xLjAzOTM3IDE0LjgzNjIgLTEuMDY3MDkgMTQuODM3OSAtMS4wOTQ2MUMxNC44NDYxIC0xLjIyNTk2IDE0Ljg1NjMgLTEuMzU3MiAxNC44NjM2IC0xLjQ4ODYxQzE0Ljg3MzQgLTEuNjY0OSAxNC44NzE3IC0xLjg0MjQzIDE0Ljg5MiAtMi4wMTc0M0MxNC45Mjc5IC0yLjMyNjc1IDE0Ljk3NTYgLTIuNjM0NzMgMTUuMDIwNiAtMi45NDI5NUMxNS4wNTQgLTMuMTcyMzEgMTUuMDc5OCAtMy40MDM1OCAxNS4xMjg4IC0zLjYyOTdDMTUuMjE0OSAtNC4wMjc1MSAxNS4zMTc5IC00LjQyMTYyIDE1LjQxMDUgLTQuODE4MDZDMTUuNDkxMiAtNS4xNjM3MSAxNS41NzU5IC01LjUwODc5IDE1LjY0MjggLTUuODU3MjFDMTUuNjk5MSAtNi4xNTAxMiAxNS43MzQ0IC02LjQ0NzE5IDE1Ljc3NDkgLTYuNzQyOTdDMTUuNzk2OSAtNi45MDM1MiAxNS44MSAtNy4wNjUyOSAxNS44MjggLTcuMjI2NDFDMTUuODUzNiAtNy40NTY1NSAxNS44ODgxIC03LjY4NjA2IDE1LjkwMzUgLTcuOTE2ODZDMTUuOTE2MSAtOC4xMDYxMyAxNS44OTk3IC04LjI5NzIgMTUuOTA4NSAtOC40ODY5QzE1LjkxNjQgLTguNjU4NjYgMTUuOTU0MiAtOC44Mjk1NyAxNS45NTUyIC05LjAwMDk5QzE1Ljk1NyAtOS4zMDIwMyAxNS45NCAtOS42MDMxNyAxNS45MzI1IC05LjkwNDNDMTUuOTI5OSAtMTAuMDA1OCAxNS45Mzg5IC0xMC4xMDgxIDE1LjkzMDggLTEwLjIwOUMxNS45MDg1IC0xMC40ODU4IDE1Ljg4MDYgLTEwLjc2MjEgMTUuODUzNyAtMTEuMDM4NUMxNS44Mjg1IC0xMS4yOTc3IDE1LjgxNDYgLTExLjU1ODggMTUuNzcyOCAtMTEuODE1M0MxNS43MDU1IC0xMi4yMjg2IDE1LjYzMjMgLTEyLjY0MTkgMTUuNTM4MSAtMTMuMDQ5N0MxNS40MTQ2IC0xMy41ODM3IDE1LjI4MDkgLTE0LjExNjEgMTUuMTI3NyAtMTQuNjQyMkMxNS4wMDYyIC0xNS4wNTk0IDE0Ljg1MDYgLTE1LjQ2NjggMTQuNzA1IC0xNS44NzY3QzE0LjY4OTggLTE1LjkxOTQgMTQuNjUyMiAtMTUuOTQxMiAxNC43Mjk2IC0xNS45NDQ1QzE0Ljg1MjEgLTE1Ljk0OTcgMTQuOTc0MyAtMTUuOTYyIDE1LjA5NjcgLTE1Ljk2OTVDMTUuMjU1MiAtMTUuOTc5MiAxNS40MTM5IC0xNS45ODU1IDE1LjU3MjMgLTE1Ljk5NjNDMTUuNzYzMyAtMTYuMDA5MiAxNS43NzgxIC0xNS45OTggMTUuODAyMyAtMTUuODA5QzE1LjgwNTkgLTE1Ljc4MSAxNS44MTY4IC0xNS43NTQxIDE1LjgyMyAtMTUuNzI2M0MxNS45MDI5IC0xNS4zNjc3IDE1Ljk4NTEgLTE1LjAwOTYgMTYuMDYxNyAtMTQuNjUwM0MxNi4xNTk5IC0xNC4xODk5IDE2LjI0ODcgLTEzLjcyNzUgMTYuMzUwMiAtMTMuMjY3OUMxNi40NTc0IC0xMi43ODI1IDE2LjU3OTUgLTEyLjMwMDMgMTYuNjg2NSAtMTEuODE0OEMxNi44MTMyIC0xMS4yMzk2IDE2LjkyNzUgLTEwLjY2MTYgMTcuMDUzNSAtMTAuMDg2M0MxNy4xNDMzIC05LjY3NjMyIDE3LjI0ODMgLTkuMjY5NzEgMTcuMzM3OCAtOC44NTk2OUMxNy40NTU2IC04LjMxOTk5IDE3LjU2MzQgLTcuNzc4MDkgMTcuNjc4MiAtNy4yMzc3MkMxNy43OTc5IC02LjY3NDA0IDE3LjkyNDEgLTYuMTExNzMgMTguMDQxNSAtNS41NDc1N0MxOC4xNDE4IC01LjA2NTg2IDE4LjI0MTIgLTQuNTgzNzMgMTguMzI2OCAtNC4wOTkyOEMxOC4zOTg5IC0zLjY5MTI0IDE4LjQ1ODEgLTMuMjgwNTEgMTguNTA5MyAtMi44NjkyNUMxOC41NTQ2IC0yLjUwNDc5IDE4LjU4OTQgLTIuMTM4NTEgMTguNjEzMiAtMS43NzIwMkMxOC42MzQgLTEuNDUxMzEgMTguNjM3OCAtMS4xMjkyMiAxOC42NDA1IC0wLjgwNzY2MUMxOC42NDM4IC0wLjQzMTIwNCAxOC42NDk1IC0wLjA1NDExMzYgMTguNjMxOCAwLjMyMTY1NEMxOC42MTgzIDAuNjA5MzM2IDE4LjU3NjcgMC44OTYzNzggMTguNTMzMiAxLjE4MTVDMTguNTIxNiAxLjI1NzM3IDE4LjU0NjUgMS4yNDM2NyAxOC41OTEgMS4yNDM0MUMxOC43NzA1IDEuMjQyMzQgMTguOTUgMS4yNDA2NiAxOS4xMjk1IDEuMjQzNDFDMTkuNjEyMyAxLjI1MDgxIDI3LjI4NjMgMS4zNDE3MSAyNy43MzIyIDEuMzQ5MjFDMzAuMzc4MiAxLjM5MzY0IDMxLjA0MjkgMi41MDQyMyAzMS4zNTQyIDMuNTY0NDVDMzEuNjQyNSA0LjU0NjM2IDMxLjU3MjEgNC4zMzQxMSAzMS42MjA1IDQuNzM0ODZDMzEuNjY3IDUuMTE4OTkgMzEuNzIyOCA1LjUwMTAxIDMxLjcyMjcgNS44ODkzNUMzMS43MjI3IDYuMTAwNTMgMzIuNzM0OCAzNC42MDk0IDMyLjc0MTYgMzQuNzg1M0MzMi43NDE2IDM1Ljg5NTkgMzEuMTkwNiAzOS44MiAyOS43ODc0IDM5LjgyWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTEzLjAwMDggMjguMzkyOEMxMy4wNTQ2IDI3LjU1MTkgMTMuMzQwOCAxMC45NDYzIDEzLjQ0ODQgOC40MjM0M0MxMy41NTYxIDUuOTAwNTkgMTQuOTAxNCA2LjA1ODI3IDE2LjMwMDUgNi4wNTgyN0MxNy42OTk2IDYuMDU4MjcgMjIuNTk2NSA2LjA1ODI3IDI0LjQ4IDYuMDU4MjdDMjYuMzYzNCA2LjA1ODI3IDI3LjExNzUgNi43NzMyOSAyNy4xNzQgOC40ODNDMjcuMjMwNCAxMC4xOTI3IDI3LjYyMDQgMjcuNjA0NCAyNy41MTI4IDI4LjM5MjhDMjYuNDM2NSAyOC4zOTI4IDEzLjgwOCAyOC40NDU0IDEzLjAwMDggMjguMzkyOFoiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==';


function hexString(textStr) {
    const byteArray = new Uint8Array(textStr);
    const hexCodes = [...byteArray].map(value => {
        const hexCode = value.toString(16);
        const paddedHexCode = hexCode.padStart(2, '0');
        return paddedHexCode;
    });
    return hexCodes.join('');
}


function sleep(msec) {
    return new Promise(resolve =>
        setTimeout(() => {
            resolve();
        }, msec)
    );
}

function reading_waiter(msec) {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            if(readingFlag){
                reject();
            }else{
                resolve();
            }
        }, msec)
    )
    .catch(() => {
        return reading_waiter(msec);
    });
}

function io_waiter(msec) {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            if(inoutFlag){
                reject();
            }else{
                resolve();
            }
        }, msec)
    )
    .catch(() => {
        return io_waiter(msec);
    });
}


function send(s_device, data) {
    if(inoutFlag){return;}
    inoutFlag = true;    
    let uint8a = new Uint8Array(data);
    //console.log("snd -> ");
    return s_device.transferOut(2, uint8a)
    .then(() => {inoutFlag = false;})
    .catch(() => {inoutFlag = false;});
}


function receive(r_device, len, cpy) {
    //console.log("rcv <- " + len);
    if(inoutFlag){return;}
    inoutFlag = true;    
    var receiveTrans = r_device.transferIn(1, len);

    while(receiveTrans == undefined){
        sleep(intvalTime_short);
        //console.log('receive undefineding...');
    }

    if(receiveTrans !== undefined){
        //console.log('receiving...');
        receiveTrans.then(result => {
            let arr = [];
            for (let i = result.data.byteOffset; i < result.data.byteLength; i++) {
                arr.push(result.data.getUint8(i));
            }
            if(cpy){
                gr_arr = JSON.parse(JSON.stringify(arr));
                //console.log("gr_arr:" + gr_arr);
            }
            return arr;
        })
        .then(() => {inoutFlag = false;})
        .catch((error) => {
            inoutFlag = false;
            console.log(error);
        });
    }
}


function session(ss_device) {
//    console.log("=== S:session ===");
//    console.log("ss_device:");
//    console.log(ss_device);


    sleep(1).then(() => {
        send(ss_device, [0x00, 0x00, 0xff, 0x00, 0xff, 0x00], false);
        return io_waiter(1);
    })
    .then(() => {
        send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x03, 0x00, 0xfd, 0xd6, 0x2a, 0x01, 0xff, 0x00], false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 6, false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 13, false);
        return io_waiter(1);
    })
    .then(() => {
        send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x03, 0x00, 0xfd, 0xd6, 0x06, 0x00, 0x24, 0x00], false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 6, false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 13, false);
        return io_waiter(1);
    })
    .then(() => {
        send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x03, 0x00, 0xfd, 0xd6, 0x06, 0x00, 0x24, 0x00], false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 6, false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 13, false);
        return io_waiter(1);
    })
    .then(() => {
        send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x06, 0x00, 0xfa, 0xd6, 0x00, 0x01, 0x01, 0x0f, 0x01, 0x18, 0x00], false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 6, false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 13, false);
        return io_waiter(1);
    })
    .then(() => {
        send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x28, 0x00, 0xd8, 0xd6, 0x02, 0x00, 0x18, 0x01, 0x01, 0x02, 0x01, 0x03, 0x00, 0x04, 0x00, 0x05, 0x00, 0x06, 0x00, 0x07, 0x08, 0x08, 0x00, 0x09, 0x00, 0x0a, 0x00, 0x0b, 0x00, 0x0c, 0x00, 0x0e, 0x04, 0x0f, 0x00, 0x10, 0x00, 0x11, 0x00, 0x12, 0x00, 0x13, 0x06, 0x4b, 0x00], false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 6, false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 13, false);
        return io_waiter(1);
    })
    .then(() => {
        send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x04, 0x00, 0xfc, 0xd6, 0x02, 0x00, 0x18, 0x10, 0x00], false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 6, false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 13, false);
        return io_waiter(1);
    })
    .then(() => {
        send(ss_device, [0x00, 0x00, 0xff, 0xff, 0xff, 0x0a, 0x00, 0xf6, 0xd6, 0x04, 0x6e, 0x00, 0x06, 0x00, 0xff, 0xff, 0x01, 0x00, 0xb3, 0x00], false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 6, false);
        return io_waiter(1);
    })
    .then(() => {
        receive(ss_device, 37, true);
        return io_waiter(1);
    })
    .then(() => {

        //console.log(gr_arr);

	    if (gr_arr != undefined){
	        if (gr_arr.length > 25){

	            let idm = gr_arr.slice(17, 25);
        	    //console.log("sliced: " + idm);
                if (idm.length > 0) {
            	    let idmStr = '';
					for (let i = 0; i < idm.length; i++) {
                	    if (idm[i] < 16) {
                	        idmStr += '0';
						}
						idmStr += idm[i].toString(16);
					}
					//console.log("Idm: " + idmStr);
                    idnum = JSON.parse(JSON.stringify(idmStr));


                    if (!crypto || !crypto.subtle) {
                        throw Error("crypto.subtle is not supported.");
                    }

                    crypto.subtle.digest('SHA-256', new TextEncoder().encode(idnum))
                    .then(idnumStr => {
                        idnum_sha256 = hexString(idnumStr);
    					//console.log("HashedIdm: " + idnum_sha256);
                    });

            	}

        	}else {
                idnum = '';
                idnum_sha256 = '';
        	}

	    } else {
				idnum = '';
                idnum_sha256 = '';
	    }

    })
    .catch((err) => {
	    console.log(err);
	})
	.finally(() => {
		setTimeout(() => {
            readingFlag = false;
        }, intvalTime_short);
	});

    return reading_waiter(1);

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

        //console.log("initializing...");
		//console.log("navigator:");
		//console.log(navigator);
		//console.log("navigator.usb:");
		//console.log(navigator.usb);
		//console.log("pasoriDevice:");
		//console.log(pasoriDevice);

        if (pasoriDevice !== undefined) {
            if(pasoriDevice.opened){
                pasoriDevice.close();
                //console.log("- pasoriDevice:" + pasoriDevice);
            }
        }

        navigator.usb.getDevices().then(devices => {
            //console.log(devices);
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


        if(pasoriDevice == null){

            var reqdevicePromise = navigator.usb.requestDevice({ filters: [{ vendorId: 0x054c }] });

            while(reqdevicePromise == undefined){
                sleep(intvalTime_short);
            }

            if (reqdevicePromise !== undefined) {

                reqdevicePromise.then(selectedDevice => {
                    pasoriDevice = selectedDevice;
                    return pasoriDevice.open();
                })
                .then(() => {
                    return pasoriDevice.selectConfiguration(1);
                })
                .then(() => {
                    return pasoriDevice.claimInterface(0);
                })
                .then(() => {
                    sleep(intvalTime_short);
                    return session(pasoriDevice);
                })
                .catch(error => { console.log(error); });

            }
        }

        console.log(PaSoRichVersion);

    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {

        this.setupTranslations();

        return {
            id: 'pasorich',
            name: formatMessage({
                id: 'pasorich.PaSoRich',
                default: 'PaSoRich'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'openPasori',
                    text: formatMessage({
                        id: 'pasorich.Connect',
                        default: 'Connect',
                        description: 'openPasori'
                    }),
                    blockType: BlockType.REPORTER
                },
                '---',
                {
                    opcode: 'readPasori',
                    text: formatMessage({
                        id: 'pasorich.readPasori',
                        default: 'read PaSoRi',
                        description: 'readPasori'
                    }),
                    blockType: BlockType.COMMAND,
                },
                /*
                {
                    opcode: 'readingDone',
                    text: formatMessage({
                        id: 'pasorich.readingDone',
                        default: 'done',
                        description: 'readingDone'
                    }),
                    blockType: BlockType.BOOLEAN
                },
                */
               '---',
               {
                    opcode: 'getIdm',
                    text: formatMessage({
                        id: 'pasorich.getIdm',
                        default: 'Idm',
                        description: 'getIdm'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'resetIdm',
                    text: formatMessage({
                        id: 'pasorich.resetIdm',
                        default: 'reset Idm',
                        description: 'resetIdm'
                    }),
                    blockType: BlockType.COMMAND,
                }
                /*
                {
                    opcode: 'getReadingFlag',
                    text: formatMessage({
                        id: 'pasorich.getReadingFlag',
                        default: 'reading',
                        description: 'getReadingFlag'
                    }),
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'getWaitingFlag',
                    text: formatMessage({
                        id: 'pasorich.getWaitingFlag',
                        default: 'waiting',
                        description: 'getWaitingFlag'
                    }),
                    blockType: BlockType.BOOLEAN
                }
                ,
                {
                    opcode: 'getHashedIdm',
                    text: formatMessage({
                        id: 'pasorich.getHashedIdm',
                        default: 'HashedIdm',
                        description: 'getHashedIdm'
                    }),
                    blockType: BlockType.REPORTER
                }
                */
            ],
            menus: {
            }
        };
    }


    readPasori () {

        //console.log('=== S:readPaSoRi ===');

        if(readingFlag){return;}
        readingFlag = true;


        if(pasoriDevice !== undefined){

            if(pasoriDevice.opened && pasoriDevice !== null){
                sleep(intvalTime_short);
                return session(pasoriDevice);
            }
            else{

                var devicePromise = navigator.usb.getDevices();

                while(devicePromise == undefined){
                    sleep(intvalTime_short);
                }

                if (devicePromise !== undefined) {
                    devicePromise.then(devices => {
                        //console.log(devices);
                        devices.map(selectedDevice => {
                            pasoriDevice = selectedDevice;
                            pasoriDevice.open().then(() => {
                                return pasoriDevice.selectConfiguration(1);
                            })
                            .then(() => {
                                return pasoriDevice.claimInterface(0);
                            })
                            .then(() => {
                                sleep(intvalTime_short);
                                return session(pasoriDevice);
                            })
                            .catch(error => { console.log(error); });

                        });
                    })
                    .catch(error => { console.log(error); });
                }

            //select

                var reqdevicePromise = navigator.usb.requestDevice({ filters: [{ vendorId: 0x054c }] });

                while(reqdevicePromise == undefined){
                    sleep(intvalTime_short);
                }

                if (reqdevicePromise !== undefined) {

                    reqdevicePromise.then(selectedDevice => {
                        pasoriDevice = selectedDevice;
                        return pasoriDevice.open();
                    })
                    .then(() => {
                        return pasoriDevice.selectConfiguration(1);
                    })
                    .then(() => {
                        return pasoriDevice.claimInterface(0);
                    })
                    .then(() => {
                        sleep(intvalTime_short);
                        return session(pasoriDevice);
                    })
                    .catch(error => { console.log(error); });

                }

            }

        }

        //console.log('=== E:readPaSoRi ===');

    }


    getIdm () {
		//console.log('=== S:getIdm ===');
        return idnum;
    }

	resetIdm () {
        idnum = '';
        idnum_sha256 ='';
        readingFlag = false;
        return;
    }

    readingDone () {
        return !readingFlag;
    }

    getReadingFlag () {
        return readingFlag;
    }

	getWaitingFlag () {
        return !readingFlag;
    }

    getHashedIdm () {
        //console.log("HashedIdm: " + idnum_sha256);
        return idnum_sha256;
    }


    openPasori () {
        //console.log('=== S:openPaSoRi ===');

        if(readingFlag){
            isConnect = formatMessage({
                id: 'pasorich.ConnectReading',
                default: 'Reading...',
                description: 'ConnectReading'
            });
            return isConnect;
        }

        if (pasoriDevice !== undefined && pasoriDevice !== null) {
            connectingCount = 0;
            isConnect = formatMessage({
                id: 'pasorich.ConnectConnected',
                default: 'Connected...',
                description: 'ConnectConnected'
            });
            return isConnect;
            //pasoriDevice.close();
            //pasoriDevice = null;
        }

        if(connectingCount >= 1){
            isConnect = formatMessage({
                id: 'pasorich.ConnectConnecting',
                default: 'Connecting...',
                description: 'ConnectConnecting'
            });
            return isConnect;
        }
        else {

            connectingCount += 1;

            isConnect = formatMessage({
                id: 'pasorich.ConnectConnecting',
                default: 'Connecting...',
                description: 'ConnectConnecting'
            });

            if (connectingCount > 1){
                return isConnect;
            }

            var reqdevicePromise = navigator.usb.requestDevice({ filters: [{ vendorId: 0x054c }] });

            while(reqdevicePromise == undefined){
                sleep(intvalTime_short);
            }

            if (reqdevicePromise !== undefined) {
               reqdevicePromise.then(selectedDevice => {
                    pasoriDevice = selectedDevice;
                    return pasoriDevice.open();
                })
                .then(() => {
                    return pasoriDevice.selectConfiguration(1);
                })
                .then(() => {
                    return pasoriDevice.claimInterface(0);
                })
                .then(() => {
                    connectingCount = 0;
                    isConnect = formatMessage({
                        id: 'pasorich.ConnectSuccess',
                        default: 'Success...',
                        description: 'ConnectSuccess'
                    });
                    return isConnect;
                })
                .catch((error) => {
                     console.log(error);
                     pasoriDevice = null;
                     connectingCount = 0;
                     isConnect = formatMessage({
                        id: 'pasorich.ConnectFailure',
                        default: 'Failure...',
                        description: 'ConnectFailure'
                    });
                     return isConnect;
                });
            }
        }

        return isConnect;

        //console.log('=== E:openPaSoRi ===');

    }


    closePasori () {
        if(readingFlag){return;}
        return pasoriDevice.close();
    }


    setupTranslations () {
        const localeSetup = formatMessage.setup();
        const extTranslations = {
            'ja': {
                'pasorich.PaSoRich': 'パソリッチ',
                'pasorich.Connect': '接続',
                'pasorich.readPasori': 'PaSoRi 読み取り',
                'pasorich.getIdm': 'Idm',
                'pasorich.getHashedIdm': 'HexIdm',
                'pasorich.resetIdm': 'Idmリセット',
                'pasorich.getReadingFlag': '読取中',
                'pasorich.getWaitingFlag': '待機中',
                'pasorich.readingDone': '読み取り完了',
                'pasorich.ConnectReading': '読取中...',
                'pasorich.push2Connect': 'クリックして接続開始',
                'pasorich.ConnectConnected': '接続完了...',
                'pasorich.ConnectConnecting': '接続中...',
                'pasorich.ConnectSuccess': '接続成功...',
                'pasorich.ConnectFailure': '接続失敗...'
            },
            'ja-Hira': {
                'pasorich.PaSoRich': 'ぱそりっち',
                'pasorich.Connect': 'せつぞく',
                'pasorich.readPasori': 'PaSoRi よみとり',
                'pasorich.getIdm': 'Idm',
                'pasorich.getHashedIdm': 'HexIdm',
                'pasorich.resetIdm': 'Idmリセット',
                'pasorich.getReadingFlag': 'よみとりちゅう',
                'pasorich.getWaitingFlag': 'たいきちゅう',
                'pasorich.readingDone': 'よみとりかんりょう',
                'pasorich.ConnectReading': 'よみとりちゅう...',
                'pasorich.push2Connect': 'クリックしてせつぞくかいし',
                'pasorich.ConnectConnected': 'せつぞくかんりょう...',
                'pasorich.ConnectConnecting': 'せつぞくちゅう...',
                'pasorich.ConnectSuccess': 'せつぞくせいこう...',
                'pasorich.ConnectFailure': 'せつぞくしっぱい...'
            }
        };
        for (const locale in extTranslations) {
            if (!localeSetup.translations[locale]) {
                localeSetup.translations[locale] = {};
            }
            Object.assign(localeSetup.translations[locale], extTranslations[locale]);
        }
    }

}

module.exports = Scratch3Pasorich;
