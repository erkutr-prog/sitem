#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "rsocket/benchmarks/Fixture.h"
#import "rsocket/benchmarks/Latch.h"
#import "rsocket/benchmarks/Throughput.h"
#import "rsocket/framing/ErrorCode.h"
#import "rsocket/framing/Frame.h"
#import "rsocket/framing/FramedDuplexConnection.h"
#import "rsocket/framing/FramedReader.h"
#import "rsocket/framing/FrameFlags.h"
#import "rsocket/framing/FrameHeader.h"
#import "rsocket/framing/FrameProcessor.h"
#import "rsocket/framing/Framer.h"
#import "rsocket/framing/FrameSerializer.h"
#import "rsocket/framing/FrameSerializer_v1_0.h"
#import "rsocket/framing/FrameTransport.h"
#import "rsocket/framing/FrameTransportImpl.h"
#import "rsocket/framing/FrameType.h"
#import "rsocket/framing/ProtocolVersion.h"
#import "rsocket/framing/ResumeIdentificationToken.h"
#import "rsocket/framing/ScheduledFrameProcessor.h"
#import "rsocket/framing/ScheduledFrameTransport.h"
#import "rsocket/internal/Allowance.h"
#import "rsocket/internal/ClientResumeStatusCallback.h"
#import "rsocket/internal/Common.h"
#import "rsocket/internal/ConnectionSet.h"
#import "rsocket/internal/KeepaliveTimer.h"
#import "rsocket/internal/ScheduledRSocketResponder.h"
#import "rsocket/internal/ScheduledSingleObserver.h"
#import "rsocket/internal/ScheduledSingleSubscription.h"
#import "rsocket/internal/ScheduledSubscriber.h"
#import "rsocket/internal/ScheduledSubscription.h"
#import "rsocket/internal/SetupResumeAcceptor.h"
#import "rsocket/internal/StackTraceUtils.h"
#import "rsocket/internal/SwappableEventBase.h"
#import "rsocket/internal/WarmResumeManager.h"
#import "rsocket/statemachine/ChannelRequester.h"
#import "rsocket/statemachine/ChannelResponder.h"
#import "rsocket/statemachine/ConsumerBase.h"
#import "rsocket/statemachine/FireAndForgetResponder.h"
#import "rsocket/statemachine/PublisherBase.h"
#import "rsocket/statemachine/RequestResponseRequester.h"
#import "rsocket/statemachine/RequestResponseResponder.h"
#import "rsocket/statemachine/RSocketStateMachine.h"
#import "rsocket/statemachine/StreamFragmentAccumulator.h"
#import "rsocket/statemachine/StreamRequester.h"
#import "rsocket/statemachine/StreamResponder.h"
#import "rsocket/statemachine/StreamStateMachineBase.h"
#import "rsocket/statemachine/StreamsWriter.h"
#import "rsocket/transports/RSocketTransport.h"
#import "rsocket/transports/tcp/TcpConnectionAcceptor.h"
#import "rsocket/transports/tcp/TcpConnectionFactory.h"
#import "rsocket/transports/tcp/TcpDuplexConnection.h"
#import "yarpl/observable/DeferObservable.h"
#import "yarpl/observable/Observable.h"
#import "yarpl/observable/ObservableConcatOperators.h"
#import "yarpl/observable/ObservableDoOperator.h"
#import "yarpl/observable/ObservableOperator.h"
#import "yarpl/observable/Observables.h"
#import "yarpl/observable/Observer.h"
#import "yarpl/observable/Subscription.h"
#import "yarpl/observable/TestObserver.h"
#import "yarpl/flowable/AsyncGeneratorShim.h"
#import "yarpl/flowable/CancelingSubscriber.h"
#import "yarpl/flowable/DeferFlowable.h"
#import "yarpl/flowable/EmitterFlowable.h"
#import "yarpl/flowable/Flowable.h"
#import "yarpl/flowable/FlowableConcatOperators.h"
#import "yarpl/flowable/FlowableDoOperator.h"
#import "yarpl/flowable/FlowableObserveOnOperator.h"
#import "yarpl/flowable/FlowableOperator.h"
#import "yarpl/flowable/Flowables.h"
#import "yarpl/flowable/FlowableTimeoutOperator.h"
#import "yarpl/flowable/Flowable_FromObservable.h"
#import "yarpl/flowable/PublishProcessor.h"
#import "yarpl/flowable/Subscriber.h"
#import "yarpl/flowable/Subscription.h"
#import "yarpl/flowable/TestSubscriber.h"
#import "yarpl/flowable/ThriftStreamShim.h"
#import "rsocket/ColdResumeHandler.h"
#import "rsocket/ConnectionAcceptor.h"
#import "rsocket/ConnectionFactory.h"
#import "rsocket/DuplexConnection.h"
#import "rsocket/Payload.h"
#import "rsocket/ResumeManager.h"
#import "rsocket/RSocket.h"
#import "rsocket/RSocketClient.h"
#import "rsocket/RSocketConnectionEvents.h"
#import "rsocket/RSocketErrors.h"
#import "rsocket/RSocketException.h"
#import "rsocket/RSocketParameters.h"
#import "rsocket/RSocketRequester.h"
#import "rsocket/RSocketResponder.h"
#import "rsocket/RSocketServer.h"
#import "rsocket/RSocketServerState.h"
#import "rsocket/RSocketServiceHandler.h"
#import "rsocket/RSocketStats.h"

FOUNDATION_EXPORT double RSocketVersionNumber;
FOUNDATION_EXPORT const unsigned char RSocketVersionString[];
