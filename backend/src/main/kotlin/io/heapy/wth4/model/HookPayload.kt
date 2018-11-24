package io.heapy.wth4.model

data class HookPayload(
    val action: String,
    val number: Int,
    val pull_request: PullRequest,
    val repository: Repository,
    val sender: Sender
)
