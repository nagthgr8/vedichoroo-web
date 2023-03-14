import { Injectable } from '@angular/core';
//import Peer, { MediaConnection, PeerJSOption } from 'peerjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import './call-info';
declare var Peer:any;
@Injectable()
export class CallService {

    peer;
    mediaCall;
	conn1: any;
	conn2: any;
    trcinfo: string = '';
    private localStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public localStream$ = this.localStreamBs.asObservable();
    private remoteStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public remoteStream$ = this.remoteStreamBs.asObservable();

    private isCallStartedBs = new Subject<boolean>();
    public isCallStarted$ = this.isCallStartedBs.asObservable();

    private isCallClosedBs = new Subject<boolean>();
    public isCallClosed$ = this.isCallClosedBs.asObservable();

    private isCallAnsweredBs = new Subject<boolean>();
    public isCallAnswered$ = this.isCallAnsweredBs.asObservable();

    private isConnectedBs = new Subject<string>();
    public isConnected$ = this.isConnectedBs.asObservable();
	
    private msgRecvedBs = new Subject<string>();
    public msgRecved$ = this.msgRecvedBs.asObservable();


    constructor() { 
	
	}
	public initPeer(): string {
        if (!this.peer || this.peer.disconnected) {
            var peerJsOptions = {
                debug: 3,
                config: {
				 iceServers: [
					{
					  urls: "stun:openrelay.metered.ca:80",
					},
					{
					  urls: "turn:openrelay.metered.ca:80",
					  username: "openrelayproject",
					  credential: "openrelayproject",
					},
					{
					  urls: "turn:openrelay.metered.ca:443",
					  username: "openrelayproject",
					  credential: "openrelayproject",
					},
					{
					  urls: "turn:openrelay.metered.ca:443?transport=tcp",
					  username: "openrelayproject",
					  credential: "openrelayproject",
					},
				  ]
			 }
            };
            try {
                let id = uuidv4();
                this.peer = new Peer(id, peerJsOptions);
				//this.addLog('Listing Peers: ');
				//this.peer.listAllPeers(list => {
					//console.log(list);
					//this.addLog(JSON.stringify(list));
					//});
                return id;
            } catch (error) {
                console.error(error);
				this.addLog(JSON.stringify(error));
				return '-1';
            }
        } else {
		  return '-1';
		}
    }
	
	public async establishMediaCall(dob: string, remotePeerId: string, eml: string, iscall: boolean) {
        try {
			console.log('estMediaCall getting user media');
			this.addLog('estMediaCall getting user media: ' + dob);
            const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
            console.log('estMediaCall connecting peer', remotePeerId);
			this.addLog('connecting to ' + remotePeerId);
            this.conn1 = this.peer.connect(remotePeerId, {metadata: {dob: dob, eml: eml}});
            this.conn1.on('error', err => {
				this.addLog('eeror ' + JSON.stringify(err));
                console.error(err);
            });
            console.log('estMediaCall connected', this.conn1);
			this.addLog('connected to ' + remotePeerId);
			this.isConnectedBs.next('connected to ' + remotePeerId);
            console.log('estMediaCall calling peer', remotePeerId);
			if(iscall) {
				this.mediaCall = this.peer.call(remotePeerId, stream);
				if (!this.mediaCall) {
					this.addLog('Unable to call remote peer');
					let errorMessage = 'Unable to connect to remote peer';
					throw new Error(errorMessage);
				}
				this.localStreamBs.next(stream);
				console.log('establishMediaCall', 'callstarted');
				this.isCallStartedBs.next(true);

				this.mediaCall.on('stream',
					(remoteStream) => {
						this.remoteStreamBs.next(remoteStream);
					});
				this.mediaCall.on('error', err => {
					console.error(err);
					this.isCallStartedBs.next(false);
				});
				this.mediaCall.on('close', () => this.onCallClose());
			}
			this.conn1.oniceconnectionstatechange = (ev: Event) => {
					console.log('RTCPeerConnection ICE state change', JSON.stringify(ev));
				if (this.conn1.iceconnectionstate === "failed" ||
					  this.conn1.iceconnectionstate === "disconnected" ||
					  this.conn1.iceconnectionstate === "closed") {		
							this.onCallClose();
					  }
			}
			this.conn1.on('open', () => {
				this.addLog('connection opened successfully');
				this.isConnectedBs.next('connection opened successfully' );
				this.conn1.on('data', (data) => {
						console.log('Received from conn2', data);
						this.isConnectedBs.next('received ' + data);
						this.addLog('received ' + data);
						if(data == 'call-accepted') {
							this.isCallAnsweredBs.next(true);
						}
						else if(data =='call-ended') {
							//this.onCallClose();
							this.closeMediaCall();
							//this.destroyPeer();
						} else if(data == 'call-cancelled'){
							//this.onCallClose();
							this.closeMediaCall();
						} else {
							this.addLog('sending msgRecved event ');
							this.isConnectedBs.next('sending msgRecved event' );
							this.msgRecvedBs.next(data);
						}
				});			
			});
			this.conn1.on('close', () => {
				this.onCallClose();
			});
        }
        catch (ex) {
            console.error(ex);
			this.addLog('ERROR' + ex.message);
            this.isCallStartedBs.next(false);
        }
    }
	public async enableCallAnswer() {
        try {
			 console.log('enableCallAnswer connecting peer');
			 this.addLog('getting user media..');
			 const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });//.then(stream => {
				this.addLog('user media received..');
			this.localStreamBs.next(stream);
			 this.addLog('waiting for new connection..' + this.peer.id);
			 this.peer.on('connection', (conn) => {
					console.log('peer-connected', conn);
					this.addLog('connected with peer ' + conn['metadata'].dob);
					console.log('metadata', conn['metadata'].dob);
					this.conn2 = conn;
			//	this.conn2.on('open', () => {
			//		console.log('peer-open');
			//  });
				this.conn2.oniceconnectionstatechange = (ev: Event) => {
					console.log('RTCPeerConnection ICE state change', JSON.stringify(ev));
					this.addLog(JSON.stringify(ev));
					if (this.conn2.iceconnectionstate === "failed" ||
					  this.conn2.iceconnectionstate === "disconnected" ||
					  this.conn2.iceconnectionstate === "closed") {		
							this.onCallClose();
					}
				}
				this.conn2.on('close', () => {
				    console.log('conn', this.conn2);
					this.onCallClose();
				});
				  this.conn2.on('data', (data) => {
					this.addLog('Received ' + data);
					console.log('Received from conn1', data);
					if(data =='call-ended') {
						this.closeMediaCall();
						//this.destroyPeer();
					}  else if(data == 'call-cancelled'){
							this.closeMediaCall();
					}else {
						this.msgRecvedBs.next(data);
					}
				});			
			});
			this.peer.on('close', () => this.onCallClose());
			this.peer.on('disconnected', () => this.onCallClose());
			console.log('enableCallAnswer listening to peer calls');
			 this.addLog('listening to incoming call..');
            this.peer.on('call', async (call) => {
			 this.addLog('call received..');
			console.log('enableCallAnswer received call');
              this.mediaCall = call;
			  console.log('enableCallAnswer getting user media');
			  //navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
                console.log('on-call', call);
                this.isCallStartedBs.next(true);
				this.isCallAnswered$
				.subscribe(res => {
					console.log('isCallAnswered$ triggered at call.service');
					this.addLog('triggered call answered event..');
					this.mediaCall.answer(stream);
				});
                this.mediaCall.on('stream', (remoteStream) => {
					this.addLog('received stream from remote server..');
                    this.remoteStreamBs.next(remoteStream);
                });
                this.mediaCall.on('error', err => {
					this.addLog('found an error..');
                    this.isCallStartedBs.next(false);
                    console.error(err);
                });
                this.mediaCall.on('close', () => this.onCallClose());
               // this.mediaCall.on('disconnected', () => this.onCallClose());
            });
		  //});
        }
        catch (ex) {
            console.error(ex);
            this.isCallStartedBs.next(false);
        }
		
    }
	public getCallerDOB() {
	 return this.conn2['metadata'].dob;
	}
	public getCallerName() {
	    this.addLog('getCallerName(): ');
		let dob: string = this.conn2['metadata'].dob;
		this.addLog(dob);
		if(dob.indexOf('#') > -1) {
				var ng = dob.split('#')[1];
				return ng.split('&')[0];
		} else return 'Unknown User';
		
	}
	public getCallerEmail() {
	 return this.conn2['metadata'].eml;
	}
	public cancelCall(iscaller) {
       this.isCallStartedBs.next(false);
	   this.isCallClosedBs.next(true);
	   if(iscaller) {
		  this.conn1?.close();
	   } else {
		  this.conn2?.close();
	   }
	}
	public closeConnection(iscaller) {
		if(iscaller) this.conn1.close();
		else this.conn2.close();
		this.onCallClose();
	}
    private onCallClose() {
		this.isCallClosedBs.next(true);
        this.remoteStreamBs?.value.getTracks().forEach(track => {
            track.stop();
        });
        this.localStreamBs?.value.getTracks().forEach(track => {
            track.stop();
        });
    }
	public muteMic() {
        this.localStreamBs?.value.getTracks().forEach(track => track.enabled = !track.enabled);
	}

    public closeMediaCall() {
        this.mediaCall?.close();
        if (!this.mediaCall) {
            this.onCallClose()
        }
        this.isCallStartedBs.next(false);
    }

    public destroyPeer() {
        this.mediaCall?.close();
        this.peer?.disconnect();
        this.peer?.destroy();
    }
	public getConnMetadata() {
		console.log('meta', this.conn2?.metadata);
		return this.conn2?.metadata;
	}
    public sendMsg(msg, iscaller) {
		if(msg == 'call-accepted') {
			this.isCallAnsweredBs.next(true);
		}		
		if(iscaller) {
			console.log('conn1', this.conn1);
			console.log('conn1 sending', msg);
				this.addLog('sending  ' + msg);
				this.conn1.send(msg);
				console.log('conn1 sent', msg);
				this.addLog('msg sent');
				if(msg =='call-ended') {
					this.closeMediaCall();
				}
		}
		else {
			    console.log('conn2', this.conn2);
				console.log('conn2 sending', msg);
				this.conn2.send(msg);
				console.log('conn2 sent', msg);
				if(msg =='call-ended') {
					this.closeMediaCall();
				}
		}
	}		
	public addLog(log) { this.trcinfo += log + "\n"; }
	public getLog() {return this.trcinfo }
 }