<!-- i18n-source: README.md@3e9e5e61a6bac2815ed0be778cb9ad84a37754cf status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg" alt="reviewready: Catches App Review rejections in CI before you submit, with the Apple source of every rule and the fix."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml/badge.svg" alt="CI durumu"></a>
<a href="https://github.com/muhittincamdali/reviewready/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg" alt="Son sürüm: v0.1.0"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg" alt="Dil sürümü: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg" alt="Lisans: MIT"></picture></a>
</p>

<p align="center">
<a href="#hızlı-başlangıç"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-tr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-tr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-tr-light.svg" alt="Başlayın"></picture></a>
<a href="https://muhittincamdali.github.io/reviewready/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-tr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-tr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-tr-light.svg" alt="Dokümantasyon"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-tr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-tr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-tr-light.svg" alt="Rehberler"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-tr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-tr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-tr-light.svg" alt="Örnekler"></picture></a>
</p>

> Bu belge İngilizce README'nin çevirisidir. İkisi arasında fark varsa güncel olan İngilizce sürümdür.

<!-- brand:end -->

Bir projenin dosyalarının zaten gösterdiği App Review ret sebepleri (eksik bir amaç dizesi (purpose
string), alfa kanalı olan bir App Store ikonu, App Store Connect'in 28 Nisan 2026'dan beri kabul
ettiğinden daha eski bir Xcode) göndermeden önce CI'da yakalanabilir. reviewready; yerel iOS, Flutter
veya React Native/Expo projesini okur ve bunları listeler. Her bulgu, dayandığı Apple sayfasını ve
proje türünüze uygun çözümü içerir. Kural kimlikleri ve çıkış kodları olan deterministik bir CLI'dır:
yapay zekâ tahmini yok, hesap yok, yükleme yok. Projenizin dosyalarını okur; derlemez, çalıştırmaz,
hiçbir şeyi değiştirmez.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-native-rejected-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-native-rejected-light.svg"><img src="docs/media/demo-native-rejected-light.svg" alt="Bir SwiftUI uygulamasında reviewready --brief: NSCameraUsageDescription olmadan kamera (RVW101), boş fotoğraf kitaplığı amaç dizesi (RVW103), alfa kanalı olan App Store ikonu (RVW503), Xcode 16.4 sabitlenmiş (RVW601), iOS 12.0 dağıtım hedefi (RVW602); ayrıca yer tutucu amaç dizesi, ihracat uyumluluğu, hesap silme, Sign in with Apple olmadan Google Sign-In ve uygulamada bulunmayan bir gizlilik manifesti için uyarılar"></picture>

<sub>Gerçek CLI'dan kaydedildi: <a href="fixtures/native-swiftui-rejected">native-swiftui-rejected
fixture</a>, testler için yazılmış ve kural başına bir sorun içeren bir SwiftUI uygulaması (<code>npm run demo</code>).</sub>

## Öne çıkanlar

- **Her kural kaynağını gösterir.** Kurallar bir veridir ([rules/app-review.json](rules/app-review.json));
  Apple'ın dokümantasyonuna, App Review Guidelines'a ve Apple'ın Upcoming Requirements sayfasına
  bağlanır (28 Ekim 2026'da okundu). Bir kuralın Apple kaynağı yoksa ya da var olmayan bir rehbere
  atıf yapıyorsa testler başarısız olur.
- **Amaç dizeleri, uygulamanın gerçekten kullandığı şeylerden çıkarılır.** Swift ve Objective-C
  kodunun çağırdığı API'ler, 15 Flutter ve 10 npm paketi (her birinin README'sinin istediği anahtarla),
  Podfile'ın permission_handler ve react-native-permissions için derlediği izinler ve Expo config
  plugin'lerinin yazacağı her şey, varsayılan metinleri dahil.
- **Simülatörde doğrulandı.** `NSContactsUsageDescription` olmadan deneme uygulamamız iOS 27.0
  Simulator'da sistemin kendi mesajıyla çöküyor; reviewready'nin verdiği çözümle izin istemini
  gösteriyor. Kayıt ve ekran görüntüleri depoda.
- **Proje türünüze uygun çözüm.** Info.plist, build setting ya da app.json; her kural alanı için bir
  rehberle.
- **CI için yapıldı.** Terminal, düz metin, Markdown ve JSON raporları; her kontrolün sonucunu içeren
  bir liste (bulundu, geçti, kontrol edilmedi, yok sayıldı); kural başına `--ignore`; ve çıkış
  kodları: 0 temiz, 1 bulgu var, 2 kullanım hatası.

## Hızlı başlangıç

**1. reviewready'yi kurun.** [Node.js](https://nodejs.org/) 22.12 veya üstü gerekir
(`node --version` sürümü gösterir; Mac'te `brew install node` kurar). Ardından paketi
[GitHub sürümünden](https://github.com/muhittincamdali/reviewready/releases) kurun:

```sh
npm i -g https://github.com/muhittincamdali/reviewready/releases/download/v0.1.0/reviewready-0.1.0.tgz
```

**2. Uygulamanızın klasöründe bir terminal açın**; `.xcodeproj`, `pubspec.yaml` ya da
`package.json` dosyasının bulunduğu klasör:

```sh
cd path/to/YourApp
```

**3. reviewready'yi çalıştırın:**

```sh
reviewready
```

**ERROR** bulgularıyla başlayın: App Review ya da App Store Connect bunları geri çevirir. Ardından
App Review'ün işaretleyebileceği **WARNING** bulgularına geçin. Her bulgu, çözümünü "How to fix"
listesinde belirtir ve dayandığı Apple sayfasına bağlanır.

Aynı paket için Homebrew (`brew install muhittincamdali/tap/reviewready`) ve npm registry
(`npx @mcamdali/reviewready`) planlanıyor.

## reviewready neleri kontrol eder

| Kural  | Önem    | Bulgu                                                                                                                     | Kaynak         |
| ------ | ------- | ------------------------------------------------------------------------------------------------------------------------- | -------------- |
| RVW101 | error   | Uygulamanın kodu ya da içerdiği bir paket korumalı bir kaynağı kullanıyor, ancak Info.plist'te bunun için amaç dizesi yok | [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), yönerge [5.1.1(ii)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage) |
| RVW102 | warning | Bir paket, özelliklerinden biri için amaç dizesi gerektiriyor (örneğin video kaydı)                                       | aynı |
| RVW103 | error   | Bir amaç dizesi boş, yalnızca boşluktan oluşuyor, dize değil ya da 4.000 bayt veya daha uzun                              | aynı |
| RVW104 | warning | Bir amaç dizesi yer tutucu, bir README örneği ya da bir config plugin'in varsayılan metni                                 | aynı |
| RVW201 | warning | `ITSAppUsesNonExemptEncryption` yok: App Store Connect her derleme için ihracat uyumluluğu sorularını sorar               | [ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption) |
| RVW301 | warning | Uygulama hesap oluşturuyor ve hesap silme bulunamadı                                                                      | yönerge [5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Offering account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/) |
| RVW401 | warning | Sign in with Apple ya da eşdeğeri olmayan üçüncü taraf girişi (Google, Facebook, LINE, Kakao, X)                          | yönerge [4.8](https://developer.apple.com/app-store/review/guidelines/#login-services) |
| RVW501 | error   | App Store ikonu (1024 × 1024) yok                                                                                         | [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon) |
| RVW502 | error   | App Store ikonu 1024 × 1024 değil                                                                                         | aynı |
| RVW503 | error   | App Store ikonunda alfa kanalı var; App Store Connect yüklemede bunu reddeder                                             | [Apple Developer Forums thread 795411](https://developer.apple.com/forums/thread/795411) (90717 mesajı) |
| RVW601 | error   | Bir derleme dosyası 26'dan eski bir Xcode sürümünü sabitliyor; 28 Nisan 2026'dan beri asgari sürüm bu                     | [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/) |
| RVW602 | error   | Dağıtım hedefi iOS 13'ün altında; 9 Eylül 2026'dan beri asgari sürüm bu                                               | aynı |
| RVW701 | warning | Uygulamada gizlilik manifesti yok                                                                                         | [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files) |
| RVW702 | warning | Gizlilik manifesti iOS klasöründe, ancak uygulama hedefinde değil                                                         | aynı |

RVW301 ve RVW401, uygulamanın çağrıları, dizeleri ve paketleri üzerinde çalışan sezgisel
yöntemlerdir ve bulgularında bunu belirtir. Gizlilik manifesti yalnızca var olup olmadığı açısından
kontrol edilir; içinde ne bildirildiği, onu ayrıntılı okuyan araçlara bırakılmıştır.

Apple, Upcoming Requirements sayfasında ya da geliştirici haberlerinde 28 Ekim 2026 itibarıyla
Xcode 26'dan sonrası için bir SDK asgarisi duyurmadı; bu yüzden reviewready bu yönde bir kontrol
yapmaz. Apple bir tane duyurduğunda, bunu söyleyen sayfayla birlikte kural verisine eklenir.

## Simülatörde

[test/simulator/contacts-probe](test/simulator/contacts-probe) içindeki deneme uygulaması açılırken
kişilere erişim ister. reviewready bunun için RVW101'i (ve gizlilik manifesti için RVW702'yi)
bildirir. [scripts/simulator-check.sh](scripts/simulator-check.sh) uygulamayı Xcode 27.1 ile derledi
ve iOS 27.0 yüklü bir iPhone 17 simülatöründe çalıştırdı: önce depodaki haliyle, sonra
reviewready'nin iki çözümüyle.

| Varyant                          | Açıldıktan 5 saniye sonra                                           | Sistemin günlüğe yazdığı                                                                                                                                                        |
| -------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NSContactsUsageDescription` yok | uygulama kapanmış                                                   | "This app has crashed because it attempted to access privacy-sensitive data without a usage description. The app's Info.plist must contain an NSContactsUsageDescription key …" |
| Anahtar var, manifest hedefte    | çalışıyor; kişiler izin istemi ve amaç dizesiyle birlikte görünüyor | hiçbir şey                                                                                                                                                                      |

<p align="center"><img src="docs/media/simulator/contacts-probe-ios27.png" width="560" alt="Xcode 27.1 ile derlenmiş deneme uygulaması, iOS 27.0 yüklü bir iPhone 17 simülatöründe. Solda: NSContactsUsageDescription olmadan uygulama çökmüş ve ana ekrana dönmüş. Sağda: anahtarla birlikte, Allow Probe to access your contacts izin istemi Probe shows which of your friends already use it amaç dizesini gösteriyor."></p>

İki çalıştırmanın tam çıktısı [docs/media/simulator](docs/media/simulator) klasöründe.

## Kurulum

Hızlı başlangıçtaki komut, `reviewready` komutunu sürüm arşivinden kurar. Bunun yerine bir projeye
eklemek için:

```sh
npm install --save-dev https://github.com/muhittincamdali/reviewready/releases/download/v0.1.0/reviewready-0.1.0.tgz
```

Ardından `npx reviewready` bu kopyayı çalıştırır. Paketin adı `@mcamdali/reviewready`; aşağıdaki
JavaScript API'si de bu adı içe aktarır. Her GitHub sürümü paketi `reviewready-<version>.tgz` olarak,
doğrulamak için bir `SHA256SUMS` dosyasıyla birlikte sunar.

## Kullanım

```text
reviewready [path] [options]
```

| Seçenek                 | Ne yapar                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `path`                  | Proje klasörü ya da `.xcodeproj`; varsayılan geçerli klasör                           |
| `-f, --format <format>` | `tty` (varsayılan), `text`, `markdown` veya `json`                                    |
| `--json`                | `--format json` ile aynı                                                              |
| `-o, --output <file>`   | Raporu terminal yerine bir dosyaya yazar                                              |
| `--fail-on <severity>`  | `warning` (varsayılan), `error`, `info` veya `none`: çıkış kodunun ne zaman 1 olacağı |
| `--ignore <rules>`      | Dışarıda bırakılacak kural kimlikleri, virgülle ayrılır; tekrarlanabilir              |
| `--brief`               | Terminal ve metin raporları: yalnızca karar ve bulgular                               |
| `--no-color`            | Terminalde bile düz metin (`NO_COLOR` ve `FORCE_COLOR` dikkate alınır)                |

Çıkış kodları: `0` `--fail-on` düzeyinde ya da üstünde hiçbir şey yok, `1` bu düzeyde ya da üstünde
bulgu var, `2` hatalı argüman, iOS projesi bulunamadı ya da beklenmeyen bir hata. Bir Xcode projesi,
bir Info.plist ya da Expo yapılandırması okunamadığında karar "Not known" olur ve `--fail-on none`
verilmedikçe çıkış kodu `1` olur: reviewready, okumadığı dosyalara dayanarak bir uygulamaya asla
"hazır" demez.

reviewready iOS uygulamasını kendisi bulur: yerel uygulamalarda kökte ya da bir klasör aşağıda bir
`.xcodeproj`, Flutter, React Native ve Expo uygulamalarında `ios/`. Her iOS uygulama hedefinin
Info.plist'ini (XML ya da ikili), build setting'lerini ve entitlement'larını, ikon setini ve gizlilik
manifestini; uygulamanın Swift, Objective-C, JavaScript, TypeScript ve Dart dosyalarını ve strings
dosyalarını; Podfile'ı ve bir Xcode sürümünü sabitleyen dosyaları okur. `ios/` klasörü olmayan bir
Expo uygulaması app.json üzerinden kontrol edilir.

### Markdown raporunu kodla birlikte saklayın

```sh
reviewready --format markdown --output reviewready.md
```

### JSON raporunu betiklerde kullanın

```sh
reviewready --json > reviewready.json
```

Her bulgu şunları içerir: `rule`, `severity`, `title`, `message`, `file`, `line`, `target`, adımları
ve rehberiyle `fix` ve `sources`; `checks` her kuralı sonucuyla listeler. Düzen `schemaVersion` 0'dır
ve 1.0'dan önce değişebilir. [examples/shell/errors-only.sh](examples/shell/errors-only.sh) bunu
`jq` ile süzer.

### CI'da çalıştırın

[examples/github-actions/reviewready.yml](examples/github-actions/reviewready.yml), uygulamaya
dokunan her pull request'in iş özetine raporu ekler ve hatalarda işi başarısız kılar. Linux'ta
çalışır: Xcode, simülatör ya da derleme gerekmez. Bkz. [CI rehberi](docs/guides/ci.md).

### JavaScript'ten

```js
import { render, scan } from '@mcamdali/reviewready';

const report = await scan('path/to/app', { ignore: ['RVW301'] });
console.log(report.verdict.text, report.summary);
console.log(render(report, 'markdown'));
```

Çalıştırılabilir sürümü [examples/api/summary.mjs](examples/api/summary.mjs) dosyasındadır.

## Demo

Terminal kayıtları, her araç zinciriyle hazırlanmış projeler olan [fixture'lar](fixtures/README.md)
üzerinde CLI'dan alınmıştır:

| Proje                                                                                             | Kayıt                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kural başına bir sorunu olan SwiftUI uygulaması                                                   | bu sayfanın başında                                                                                                                                     |
| Kamera, image_picker, permission_handler ve Google Sign-In içeren Flutter 3.47.5 uygulaması       | [açık](docs/media/demo-flutter-light.svg) · [koyu](docs/media/demo-flutter-dark.svg)                                                                    |
| `ios/` klasörü olmayan Expo SDK 58 uygulaması: config plugin'ler, Xcode 16.4 içeren bir EAS imajı | [açık](docs/media/demo-expo-light.svg) · [koyu](docs/media/demo-expo-dark.svg)                                                                          |
| Tüm kontrolleri geçen UIKit uygulaması                                                            | [açık](docs/media/demo-native-ready-light.svg) · [koyu](docs/media/demo-native-ready-dark.svg)                                                          |
| iOS 27.0'da `scripts/simulator-check.sh`, çözümler olmadan ve çözümlerle                          | [eksik](docs/media/demo-simulator-contacts-probe-missing-27.0-light.svg) · [düzeltilmiş](docs/media/demo-simulator-contacts-probe-fixed-27.0-light.svg) |

28 Ekim 2026'da Node.js 26.12 yüklü bir Mac'te (Apple silicon, M5 Max) ölçüldü: altı fixture
üzerinde `node dist/cli/main.js --json` komutunun 100'er çalıştırmalık üç seti; Node.js başlangıç
süresi dahil. Üç setin medyanları 0,110, 0,112 ve 0,109 saniyeydi; en yavaş çalıştırma 0,24 saniye
sürdü. Test paketinde 319 test var (`npm test`, aynı makine).

## Durum

| Özellik                                                                                                                                                        | Durum             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Yerel, Flutter, React Native ve Expo proje algılama                                                                                                            | çalışıyor         |
| Info.plist, build setting'ler, entitlement'lar, ikonlar, gizlilik manifestleri, kaynak kodu, paketler, Podfile ve Expo yapılandırması üzerinde RVW101 – RVW702 | çalışıyor         |
| Terminal, metin, Markdown ve JSON raporları; kontrol listesi; `--ignore`, `--brief`, `--fail-on` çıkış kodları                                                 | çalışıyor         |
| Harici ödeme bağlantıları ve In-App Purchase (guideline 3.1.1), yaş derecelendirmesi soruları                                                                  | planlanıyor (0.2) |
| `.xcconfig` build setting'leri, uygulamanın Swift paketleri ve Pod'ları, `app.config.js`                                                                       | planlanıyor (0.2) |
| SARIF çıktısı ve bir GitHub Action                                                                                                                             | planlanıyor (0.3) |
| npm registry ve Homebrew                                                                                                                                       | planlanıyor       |
| Kararlı kural şeması ve JSON düzeni                                                                                                                            | planlanıyor (1.0) |

## Sınırlar

- **Derleyici değil, desen eşleştirme.** API, hesap ve giriş kuralları, yorumları ve dizeleri
  boşaltılmış kaynak metin üzerinde çalışan düzenli ifadelerdir. Üretilmiş, makroların arkasına
  gizlenmiş, çalışma zamanında oluşturulmuş ya da alışılmadık biçimde yazılmış kod gözden kaçabilir
  veya yanlışlıkla eşleşebilir.
- **Paketler adlarıyla.** Bir paketin amaç dizeleri, kural verisinde listelendiği şekliyle
  README'sinden, orada belirtilen sürüm için alınır. Tabloda olmayan paketler ile `node_modules`,
  Pod'lar ve Swift paketlerinin içindeki yerel kod okunmaz.
- **Build setting'ler yalnızca project.pbxproj'dan.** `.xcconfig` dosyaları okunmaz. Bir hedefin
  Info.plist'i okunamadığında sonuç "not known" olur ve rapor nedenini belirtir.
- **Expo yapılandırması JSON olarak.** `app.config.js` ve `app.config.ts` çalıştırılmaz, bu yüzden
  sonucu "not known" yaparlar; app.json okunur.
- **Yalnızca dosyalar.** reviewready uygulamayı derlemez, ekranlarına bakmaz; App Review da
  dosyaların gösterdiğinden fazlasına göre karar verir. Bu depodaki simülatör kayıtları, bir Mac'te
  çalıştırılan `scripts/simulator-check.sh` betiğinden gelir.
- **Sınırlı girdi.** Bir proje bir pull request'ten gelebileceği için reviewready, proje dosyası
  başına en fazla 32 MB okur; kaynak dosyalarda ise dosya başına 4 MB, toplamda 20.000 dosya ve
  128 MB okur. Dışarıda bıraktıkları raporun notlarında listelenir. Desenler, bir milyon karakterlik
  kötü niyetle hazırlanmış dosyalarda test edilmiştir.

## Dokümantasyon

API başvurusu ve rehberler: [muhittincamdali.github.io/reviewready](https://muhittincamdali.github.io/reviewready/).

## Rehberler

- [Amaç dizeleri](docs/guides/purpose-strings.md)
- [İhracat uyumluluğu](docs/guides/export-compliance.md)
- [Hesap silme ve giriş hizmetleri](docs/guides/accounts-and-sign-in.md)
- [App Store ikonu](docs/guides/app-icon.md)
- [Xcode ve iOS asgari sürümleri](docs/guides/xcode-and-ios-minimums.md)
- [Gizlilik manifesti](docs/guides/privacy-manifest.md)
- [reviewready'yi CI'da çalıştırın](docs/guides/ci.md)

## Kaynaklar

28 Ekim 2026'da okundu:

- Apple: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (son
  güncelleme 16 Ekim 2026), [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/),
  [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources),
  [Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/),
  [Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations),
  [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files),
  [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon)
  ve her kuralın [rules/app-review.json](rules/app-review.json) içinde bağladığı sayfalar.
- Expo: [app config](https://docs.expo.dev/versions/latest/config/app/),
  [privacy manifests](https://docs.expo.dev/guides/apple-privacy/) ve npm'de yayımlandığı haliyle
  SDK 58 paketlerinin config plugin'leri ile `@expo/prebuild-config` 58.0.16.
- Kural verisindeki her Flutter ve npm paketinin README'si, belirtilen sürümde.

## Gereksinimler

macOS, Linux veya Windows üzerinde Node.js 22.12 veya üstü. Bir projeyi okumak için başka bir şey
gerekmez: Xcode, Flutter ya da React Native araç zinciri gerekmez. Simülatör betiği için Xcode ve
XcodeGen yüklü bir Mac gerekir.

## Mimari

```text
detectProject      native | flutter | react-native | expo, the iOS folder, the packages it ships
  ─► collectApp    app targets: Info.plist keys, build settings, entitlements, icon, privacy
                   manifests; Expo config, Podfile permissions, pinned Xcode versions, sources
  ─► checkApp      RVW101–104 purpose strings · RVW201 export compliance · RVW301/401 accounts
                   · RVW501–503 icon · RVW601/602 minimums · RVW701/702 privacy manifest
                   rules/app-review.json: rule text, fixes, sources and tables (validated with zod)
  ─► scan          findings, verdict, the result of every check, notes
  ─► render        tty | text | markdown | json
```

- Kural verisi koddan ayrıdır ve sürümlenir (`app-review@2026.10.28`).
- CLI (`src/cli/`) yalnızca argümanları ayrıştırır, renkleri ve genişlikleri seçer ve çıkış kodunu
  belirler.

## İlgili projeler

[glassready](https://github.com/muhittincamdali/glassready), iOS 27 SDK'sı ile derlenmiş bir
uygulamada Liquid Glass'ın nelerin değiştirdiğini, [sdkbump](https://github.com/muhittincamdali/sdkbump)
ise uygulamanın UIScene yaşam döngüsüyle açılıp açılmadığını gösterir. reviewready ise App Review'ün
uygulamayı geçirip geçirmeyeceğini yanıtlar.

## SSS

**Temiz bir rapor, uygulamanın incelemeyi geçeceği anlamına mı gelir?** Hayır. reviewready, dosyaların
yukarıda sıralanan kurallar için gösterdiklerini kontrol eder. App Review ayrıca çalışan uygulamaya,
üst verisine ve hiçbir dosyanın gösteremeyeceği yönergelere de bakar.

**Uygulamam mikrofonu kullanmıyor, ama RVW102 mikrofon istiyor.** RVW102, bir paketin yalnızca tek
bir özellik için gereksindiği anahtar hakkında bir uyarıdır. Uygulama o özelliği kullanmıyorsa hiçbir
şeyi değiştirmeniz gerekmez: `--ignore RVW102`.

**reviewready projemi değiştirir mi?** Hayır. Projeyi okur ve yalnızca istediğiniz raporu yazar.

## Katkıda bulunma

Katkılarınızı bekliyoruz. Pull request açmadan önce [CONTRIBUTING.md](CONTRIBUTING.md) dosyasını ve
[davranış kurallarını](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md)
okuyun. Güvenlik açıklarını [SECURITY.md](SECURITY.md) dosyasında anlatıldığı gibi bildirin.

## Lisans

MIT lisansıyla yayımlanmıştır. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.
