package com.cos.chatapp;

import java.time.LocalDateTime;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@RequiredArgsConstructor
@RestController // 데이터 리턴 서버
public class ChatController {

	private final ChatRepository chatRepository;

	// Flux 지속적으로 데이터를 계속 흘러보내기
	// SSE프로토콜과 TextEventStream 데이터가 생길때마다 지속적으로 보냄
	@GetMapping(value = "/sender/{sender}/receiver/{receiver}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public Flux<Chat> getMsg(@PathVariable String sender, @PathVariable String receiver) {
		return chatRepository.mFindBySender(sender, receiver)
				.subscribeOn(Schedulers.boundedElastic());
	}

	// Mono 한번만 실행
	@PostMapping("/chat")
	public Mono<Chat> setMsg(@RequestBody Chat chat) {
		chat.setCreatedAt(LocalDateTime.now());
		return chatRepository.save(chat);
	}

}
