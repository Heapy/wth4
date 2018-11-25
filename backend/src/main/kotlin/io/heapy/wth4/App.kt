package io.heapy.wth4

import io.heapy.wth4.model.HookPayload
import io.heapy.wth4.model.PayPayload
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.application.log
import io.ktor.features.CORS
import io.ktor.features.CallLogging
import io.ktor.features.ContentNegotiation
import io.ktor.jackson.jackson
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.post
import io.ktor.routing.routing
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.util.url
import org.kohsuke.github.GHPullRequest
import org.kohsuke.github.GitHub
import org.slf4j.event.Level

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

        install(CallLogging) {
            this.level = Level.INFO
        }

        routing {
            post("/pr") {
                try {
                    val pr = call.receive<HookPayload>()

                    if (pr.action == "opened") {
                        getPR(pr.repository.full_name, pr.pull_request.number).comment(initMessage(pr))
                    }
                } catch (e: Exception) {
                    log.error("Error in /pr", e)
                }

                call.respond(Response("ok"))
            }
            post("/pay") {
                try {
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
                } catch (e: Exception) {
                    log.error("Error in /pay", e)
                }
                call.respond(Response("ok"))
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

fun initMessage(p: HookPayload): String {
    return """Ай воут фор:
    :+1: [Мерж](${link(p, "true")})
    :-1: [Деклайн](${link(p, "false")})
    """
}

fun link(p: HookPayload, choice: String): String {
    return url {
        host = "itx.ai"
        parameters.append("pull_request_id", p.pull_request.number.toString())
        parameters.append("repo", p.repository.full_name)
        parameters.append("amount", "5")
        parameters.append("choice", choice)
        parameters.append("description", p.pull_request.title)
    }
}

data class Response(
    val status: String
)
