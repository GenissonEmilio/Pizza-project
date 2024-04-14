// build.gradle

// Configurações básicas do projeto
plugins {
    id 'java'
}

// Configurações do Android (se estiver desenvolvendo um aplicativo Android)
android {
    compileSdkVersion 31
    buildToolsVersion "31.0.0"

    defaultConfig {
        applicationId "com.example.myapp"
        minSdkVersion 21
        targetSdkVersion 31
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            // Configurações para a versão de lançamento
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

// Dependências do projeto (se houver)
dependencies {
    // Adicione as dependências do seu projeto aqui
}
