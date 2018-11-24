package io.heapy.wth4.model

class PayPayload(
        val repository: String,
        val prId: Int,
        val amount: Int,
        val choice: Boolean
)