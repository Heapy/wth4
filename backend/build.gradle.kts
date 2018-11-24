plugins {
    id("org.jetbrains.kotlin.jvm").version("1.3.10")
    application
}

repositories {
    jcenter()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    // https://mvnrepository.com/artifact/org.kohsuke/github-api
    implementation("org.kohsuke:github-api:1.95")
    compile("io.ktor:ktor-server-netty:1.0.0")
    compile("io.ktor:ktor-jackson:1.0.0")

    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit")
}

application {
    mainClassName = "io.heapy.wth4.AppKt"
}
