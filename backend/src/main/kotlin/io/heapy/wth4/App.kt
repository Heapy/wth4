package io.heapy.wth4

import io.heapy.wth4.model.HookPayload
import io.heapy.wth4.model.PayPayload
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.CORS
import io.ktor.features.ContentNegotiation
import io.ktor.jackson.jackson
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.post
import io.ktor.routing.routing
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import org.kohsuke.github.GHPullRequest
import org.kohsuke.github.GitHub

val USERNAME = "buy-bitcoin-wth"
val PASSWORD = "lolpop55555"
val r = Regex("Deposit (-?[0-9]*)\\$")

fun main(args: Array<String>) {
    val server = embeddedServer(Netty, port = 8080) {
        install(ContentNegotiation) {
            jackson {
            }
        }
        install(CORS) {
            anyHost()
        }
        routing {
            post("/pr") {
                val pr = call.receive<HookPayload>()

                if (pr.action == "opened") {
                    getPR(pr.repository.full_name, pr.pull_request.number).comment(initMessage(pr))
                }
            }
            post("/pay") {
                val payload = call.receive<PayPayload>()
                val pr = getPR(payload.repository, payload.prId)
                val deposit = getDeposit(pr)
                val newDeposit = if (payload.choice) deposit + payload.amount else deposit - payload.amount

                pr.comment("${if (payload.choice) "+" else "-"}${payload.amount}. Deposit $newDeposit$.")

                if (newDeposit >= 50) {
                    pr.merge("Merge it!!!")
                }

                if (newDeposit <= -50) {
                    pr.close()
                }

                call.respond("hui")
            }
        }
    }
    server.start(wait = true)
}

fun getDeposit(pr: GHPullRequest): Int {
    val comment = pr.comments.findLast { it.body.contains("Deposit") } ?: return 0

    return r.find(comment.body)!!.groupValues.get(1).toInt()
}

fun getPR(repository: String, prId: Int) = GitHub.connectUsingPassword(USERNAME, PASSWORD)
        .getRepository(repository)
        .getPullRequest(prId)

fun initMessage(p: HookPayload) =
    """Ай воут фор:
    :+1: [Мерж](http://itx.ai/?pull_request_id=${p.pull_request.number}&repo=${p.repository.full_name}&amount=5&choice=true&description=${p.pull_request.title})
    :-1: [Деклайн](http://itx.ai/?pull_request_id=${p.pull_request.number}&repo=${p.repository.full_name}&amount=5&choice=false&description=${p.pull_request.title})
    """
