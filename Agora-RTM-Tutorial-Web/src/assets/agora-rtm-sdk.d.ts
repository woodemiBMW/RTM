
declare enum ConnectionChangeReason {
    LOGIN = "LOGIN",
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGIN_FAILURE = "LOGIN_FAILURE",
    LOGIN_TIMEOUT = "LOGIN_TIMEOUT",
    INTERRUPTED = "INTERRUPTED",
    LOGOUT = "LOGOUT",
    BANNED_BY_SERVER = "BANNED_BY_SERVER",
    REMOTE_LOGIN = "REMOTE_LOGIN"
}
declare enum ConnectionState {
    DISCONNECTED = "DISCONNECTED",
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED",
    RECONNECTING = "RECONNECTING",
    ABORTED = "ABORTED"
}
declare enum LocalInvitationState {
    IDLE = "IDLE",
    SENT_TO_REMOTE = "SENT_TO_REMOTE",
    RECEIVED_BY_REMOTE = "RECEIVED_BY_REMOTE",
    ACCEPTED_BY_REMOTE = "ACCEPTED_BY_REMOTE",
    REFUSED_BY_REMOTE = "REFUSED_BY_REMOTE",
    CANCELED = "CANCELED",
    FAILURE = "FAILURE"
}
declare enum RemoteInvitationState {
    INVITATION_RECEIVED = "INVITATION_RECEIVED",
    ACCEPT_SENT_TO_LOCAL = "ACCEPT_SENT_TO_LOCAL",
    REFUSED = "REFUSED",
    ACCEPTED = "ACCEPTED",
    CANCELED = "CANCELED",
    FAILURE = "FAILURE"
}
declare enum LocalInvitationFailureReason {
    UNKNOWN = "UNKNOWN",
    PEER_NO_RESPONSE = "PEER_NO_RESPONSE",
    INVITATION_EXPIRE = "INVITATION_EXPIRE",
    PEER_OFFLINE = "PEER_OFFLINE",
    NOT_LOGGEDIN = "NOT_LOGGEDIN"
}
declare enum RemoteInvitationFailureReason {
    UNKNOWN = "UNKNOWN",
    PEER_OFFLINE = "PEER_OFFLINE",
    ACCEPT_FAILURE = "ACCEPT_FAILURE",
    INVITATION_EXPIRE = "INVITATION_EXPIRE"
}

declare type ListenerType<T> = [T] extends [(...args: infer U) => any]
  ? U
  : [T] extends [void]
  ? []
  : [T];
declare class EventEmitter<TEventRecord> {
  static defaultMaxListeners: number;
  on<P extends keyof TEventRecord, T>(
    this: T,
    event: P,
    listener: (...args: ListenerType<TEventRecord[P]>) => void
  ): this;

  once<P extends keyof TEventRecord, T>(
    this: T,
    event: P,
    listener: (...args: ListenerType<TEventRecord[P]>) => void
  ): this;

  off<P extends keyof TEventRecord, T>(
    this: T,
    event: P,
    listener: (...args: any[]) => any
  ): this;

  removeAllListeners<P extends keyof TEventRecord, T>(this: T, event?: P): this;
  listeners<P extends keyof TEventRecord, T>(this: T, event: P): Function[];
  rawListeners<P extends keyof TEventRecord, T>(this: T, event: P): Function[];
  listenerCount<P extends keyof TEventRecord, T>(this: T, event: P): number;
}

 interface LocalInvitationEvents {
  LocalInvitationAccepted(response: string): void;
  LocalInvitationRefused(response: string): void;
  LocalInvitationReceivedByPeer(): void;
  LocalInvitationCanceled(): void;
  LocalInvitationFailure(reason: LocalInvitationFailureReason): void;
}
declare class LocalInvitation extends EventEmitter<
  LocalInvitationEvents
> {
  readonly response: string;
  readonly state: LocalInvitationState;
  content: string;
  calleeId: string;
  send(): void;
  cancel(): void;
}

interface RemoteInvitationEvents {
  RemoteInvitationCanceled(): void;
  RemoteInvitationRefused(): void;
  RemoteInvitationAccepted(): void;
  RemoteInvitationFailure(reason: RemoteInvitationFailureReason): void;
}
declare class RemoteInvitation extends EventEmitter<
  RemoteInvitationEvents
> {
  readonly callerId: string;
  readonly content: string;
  readonly state: RemoteInvitationState;
  response: string;
  accept(): void;
  refuse(): void;
}

interface RtmMessage {
  text: string;
}

declare class RtmChannel extends EventEmitter<RtmChannelEvents> {
  readonly channelId: string;

  sendMessage(message: RtmMessage): Promise<void>;

  join(): Promise<void>;

  leave(): Promise<void>;

  getMembers(): Promise<string[]>;

  on<EventName extends keyof RtmChannelEvents>(
    eventName: EventName,
    listener: (...args: ListenerType<RtmChannelEvents[EventName]>) => any
  ): this;
}

interface RtmChannelEvents {
  ChannelMessage: (message: RtmMessage, memberId: string) => void;

  MemberLeft: (memberId: string) => void;

  MemberJoined: (memberId: string) => void;
}

interface RtmPeerMessageSendResult {
  hasPeerReceived: boolean;
}

declare class RtmClient extends EventEmitter<RtmClientEvents> {
  login(options: { uid: string; token?: string }): Promise<void>;

  logout(): Promise<void>;

  sendMessageToPeer(
    message: RtmMessage,
    peerId: string
  ): Promise<RtmPeerMessageSendResult>;

  createChannel(channelId: string): RtmChannel;
  createLocalInvitation(calleeId: string): LocalInvitation;

  on<EventName extends keyof RtmClientEvents>(
    eventName: EventName,
    listener: (...args: ListenerType<RtmClientEvents[EventName]>) => any
  ): this;
}

interface RtmClientEvents {
  MessageFromPeer: (message: RtmMessage, peerId: string) => void;

  ConnectionStateChanged: (
    newState: ConnectionState,
    reason: ConnectionChangeReason
  ) => void;
  RemoteInvitationReceived(remoteInvitation: RemoteInvitation): void;
}

interface RtmParameters {
  enableLogUpload?: boolean;
}

declare namespace AgoraRTM {
  const VERSION: string;

  const BUILD: string;

  function createInstance(appId: string, params?: RtmParameters): RtmClient;
}

export = AgoraRTM;
