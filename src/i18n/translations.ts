export type Locale = 'bs' | 'en' | 'de'

export interface LanguageOption {
  locale: Locale
  label: string
  flag: string
}

export const LANGUAGES: LanguageOption[] = [
  { locale: 'bs', label: 'Bosanski', flag: '🇧🇦' },
  { locale: 'en', label: 'English', flag: '🇬🇧' },
  { locale: 'de', label: 'Deutsch', flag: '🇩🇪' },
]

export const DEFAULT_LOCALE: Locale = 'bs'

type Dictionary = Record<string, string>

const bs: Dictionary = {
  'common.cancel': 'Otkaži',
  'common.save': 'Sačuvaj',
  'common.saving': 'Čuvanje...',
  'common.loading': 'Učitavanje...',

  'login.title': 'Prijava',
  'login.subtitle': 'Evidencija članarina — prijavite se svojim nalogom.',
  'login.email': 'Email',
  'login.password': 'Lozinka',
  'login.submit': 'Prijavi se',
  'login.submitting': 'Prijavljivanje...',
  'login.error.invalidEmail': 'Neispravna email adresa.',
  'login.error.userDisabled': 'Ovaj nalog je onemogućen.',
  'login.error.wrongCredentials': 'Pogrešan email ili lozinka.',
  'login.error.tooManyRequests': 'Previše pokušaja. Pokušajte ponovo kasnije.',
  'login.error.generic': 'Prijava nije uspjela. Pokušajte ponovo.',

  'dashboard.headerTitle': 'Evidencija članarina',
  'dashboard.logout': 'Odjava',
  'dashboard.searchPlaceholder': 'Pretraga po imenu ili broju kartice...',
  'dashboard.addMember': 'Dodaj novog člana',
  'dashboard.periodTitle': 'Period članarine',
  'dashboard.periodDescription':
    'Trenutno se članarina može evidentirati od {{from}}. do {{to}}. godine.',
  'dashboard.extendPeriod': 'Produži period',
  'dashboard.mosqueName': 'Naziv džamije',
  'dashboard.yearFrom': 'Od godine',
  'dashboard.yearTo': 'Do godine',
  'dashboard.cardsPerPage': 'Kartica po stranici',
  'dashboard.printSelected': 'Štampaj odabrane ({{count}})',
  'dashboard.colName': 'Ime i prezime',
  'dashboard.colCardNumber': 'Broj kartice',
  'dashboard.colJoined': 'Učlanjen',
  'dashboard.colStatus': 'Status',
  'dashboard.colPaidYears': 'Plaćeno godina',
  'dashboard.colTotalPaid': 'Ukupno uplaćeno',
  'dashboard.statusRegular': 'Redovan',
  'dashboard.statusIrregular': 'Nije redovan',
  'dashboard.noResults': 'Nema pronađenih članova.',
  'dashboard.previousPage': 'Prethodna',
  'dashboard.nextPage': 'Sljedeća',
  'dashboard.pageOf': 'Stranica {{page}} od {{total}}',
  'dashboard.summaryAllTime': 'Ukupno uplaćeno (sve godine)',
  'dashboard.summaryCurrentYear': 'Uplaćeno za {{year}}. godinu',
  'dashboard.summaryStatus': 'Redovni / Neredovni članovi',
  'dashboard.footerTotalLabel': 'Ukupno (filtrirano)',
  'dashboard.deleteAria': 'Obriši {{name}}',
  'dashboard.selectAria': 'Odaberi {{name}}',
  'dashboard.selectAllAria': 'Odaberi sve',
  'dashboard.toastSelectAtLeastOne': 'Odaberite barem jednog člana za štampu.',
  'dashboard.toastInvalidYearRange': 'Period godina nije ispravan.',
  'dashboard.toastMemberDeleted': 'Član je uklonjen.',
  'dashboard.toastDeleteError':
    'Došlo je do greške prilikom brisanja. Pokušajte ponovo.',
  'dashboard.deleteDialogTitle': 'Ukloniti člana?',
  'dashboard.deleteDialogDescription':
    '{{name}} će biti uklonjen(a) sa liste članova. Podaci i istorija članarina se ne brišu trajno i mogu se vratiti po potrebi iz baze.',
  'dashboard.deleteConfirm': 'Ukloni',
  'dashboard.deleting': 'Brisanje...',

  'memberForm.editTitle': 'Uredi člana',
  'memberForm.addTitle': 'Dodaj novog člana',
  'memberForm.description':
    'Podaci o članu i cijela tabela članarina ({{from}}–{{to}}) se čuvaju zajedno.',
  'memberForm.firstName': 'Ime',
  'memberForm.lastName': 'Prezime',
  'memberForm.cardNumber': 'Broj članske karte',
  'memberForm.cardNumberAuto': 'Biće automatski dodijeljen',
  'memberForm.joinDate': 'Datum učlanjenja',
  'memberForm.phone': 'Telefon',
  'memberForm.address': 'Adresa',
  'memberForm.isRegularMember': 'Redovan član',
  'memberForm.duplicateWarning':
    'Član po imenu {{name}} već postoji. Uredite postojeći zapis umjesto dupliciranja.',
  'memberForm.editExisting': 'Uredi postojećeg',
  'memberForm.familyInfoButton': 'Podaci o porodici (opciono)',
  'memberForm.filled': 'Popunjeno',
  'memberForm.paymentsTitle': 'Članarina po godinama (iznos u {{currency}})',
  'memberForm.requiredNameError': 'Ime i prezime su obavezni.',
  'memberForm.toastUpdated': 'Podaci o članu su ažurirani.',
  'memberForm.toastCreated': 'Novi član je dodan.',
  'memberForm.toastSaveError':
    'Došlo je do greške prilikom čuvanja. Pokušajte ponovo.',

  'familyInfo.title': 'Podaci o porodici (opciono)',
  'familyInfo.description': 'Ovi podaci nisu obavezni i mogu se dopuniti kasnije.',
  'familyInfo.spouseName': 'Ime supruge',
  'familyInfo.includeSpouseInPrint':
    'Prikaži i ime supruge na članskoj kartici prilikom štampanja',
  'familyInfo.memberCount': 'Broj članova porodice',
  'familyInfo.ages': 'Starost članova porodice',
  'familyInfo.phones': 'Telefonski brojevi',
  'familyInfo.notes': 'Napomena',
  'familyInfo.notesPlaceholder': 'Dodatne napomene...',
  'familyInfo.save': 'Sačuvaj podatke',

  'extendYear.title': 'Produži period članarine',
  'extendYear.description':
    'Trenutni period je {{from}}–{{to}}. Ova promjena važi za sve članove i ne briše postojeće podatke.',
  'extendYear.newLastYear': 'Nova zadnja godina',
  'extendYear.errorMustBeGreater': 'Nova godina mora biti veća od {{current}}.',
  'extendYear.toastExtended': 'Period članarine je produžen do {{year}}.',
  'extendYear.toastError': 'Došlo je do greške. Pokušajte ponovo.',

  'protectedRoute.loading': 'Učitavanje...',

  'printLayout.cardNumberLabel': 'Broj',
}

const en: Dictionary = {
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.saving': 'Saving...',
  'common.loading': 'Loading...',

  'login.title': 'Login',
  'login.subtitle': 'Membership register — sign in with your account.',
  'login.email': 'Email',
  'login.password': 'Password',
  'login.submit': 'Log in',
  'login.submitting': 'Logging in...',
  'login.error.invalidEmail': 'Invalid email address.',
  'login.error.userDisabled': 'This account has been disabled.',
  'login.error.wrongCredentials': 'Incorrect email or password.',
  'login.error.tooManyRequests': 'Too many attempts. Please try again later.',
  'login.error.generic': 'Login failed. Please try again.',

  'dashboard.headerTitle': 'Membership Register',
  'dashboard.logout': 'Log out',
  'dashboard.searchPlaceholder': 'Search by name or card number...',
  'dashboard.addMember': 'Add new member',
  'dashboard.periodTitle': 'Membership period',
  'dashboard.periodDescription':
    'Membership fees can currently be recorded from {{from}} to {{to}}.',
  'dashboard.extendPeriod': 'Extend period',
  'dashboard.mosqueName': 'Mosque name',
  'dashboard.yearFrom': 'From year',
  'dashboard.yearTo': 'To year',
  'dashboard.cardsPerPage': 'Cards per page',
  'dashboard.printSelected': 'Print selected ({{count}})',
  'dashboard.colName': 'Full name',
  'dashboard.colCardNumber': 'Card number',
  'dashboard.colJoined': 'Joined',
  'dashboard.colStatus': 'Status',
  'dashboard.colPaidYears': 'Years paid',
  'dashboard.colTotalPaid': 'Total paid',
  'dashboard.statusRegular': 'Regular',
  'dashboard.statusIrregular': 'Not regular',
  'dashboard.noResults': 'No members found.',
  'dashboard.previousPage': 'Previous',
  'dashboard.nextPage': 'Next',
  'dashboard.pageOf': 'Page {{page}} of {{total}}',
  'dashboard.summaryAllTime': 'Total paid (all years)',
  'dashboard.summaryCurrentYear': 'Paid for {{year}}',
  'dashboard.summaryStatus': 'Regular / Irregular members',
  'dashboard.footerTotalLabel': 'Total (filtered)',
  'dashboard.deleteAria': 'Delete {{name}}',
  'dashboard.selectAria': 'Select {{name}}',
  'dashboard.selectAllAria': 'Select all',
  'dashboard.toastSelectAtLeastOne': 'Select at least one member to print.',
  'dashboard.toastInvalidYearRange': 'The year range is invalid.',
  'dashboard.toastMemberDeleted': 'Member removed.',
  'dashboard.toastDeleteError':
    'An error occurred while deleting. Please try again.',
  'dashboard.deleteDialogTitle': 'Remove member?',
  'dashboard.deleteDialogDescription':
    '{{name}} will be removed from the member list. Their data and payment history are not permanently deleted and can be restored from the database if needed.',
  'dashboard.deleteConfirm': 'Remove',
  'dashboard.deleting': 'Deleting...',

  'memberForm.editTitle': 'Edit member',
  'memberForm.addTitle': 'Add new member',
  'memberForm.description':
    'Member details and the full membership table ({{from}}–{{to}}) are saved together.',
  'memberForm.firstName': 'First name',
  'memberForm.lastName': 'Last name',
  'memberForm.cardNumber': 'Card number',
  'memberForm.cardNumberAuto': 'Will be assigned automatically',
  'memberForm.joinDate': 'Join date',
  'memberForm.phone': 'Phone',
  'memberForm.address': 'Address',
  'memberForm.isRegularMember': 'Regular member',
  'memberForm.duplicateWarning':
    'A member named {{name}} already exists. Edit the existing record instead of duplicating it.',
  'memberForm.editExisting': 'Edit existing',
  'memberForm.familyInfoButton': 'Family information (optional)',
  'memberForm.filled': 'Filled in',
  'memberForm.paymentsTitle': 'Membership fees by year (amount in {{currency}})',
  'memberForm.requiredNameError': 'First and last name are required.',
  'memberForm.toastUpdated': 'Member details have been updated.',
  'memberForm.toastCreated': 'New member added.',
  'memberForm.toastSaveError': 'An error occurred while saving. Please try again.',

  'familyInfo.title': 'Family information (optional)',
  'familyInfo.description': 'This information is optional and can be added later.',
  'familyInfo.spouseName': "Spouse's name",
  'familyInfo.includeSpouseInPrint':
    "Also show spouse's name on the membership card when printing",
  'familyInfo.memberCount': 'Number of family members',
  'familyInfo.ages': 'Ages of family members',
  'familyInfo.phones': 'Phone numbers',
  'familyInfo.notes': 'Notes',
  'familyInfo.notesPlaceholder': 'Additional notes...',
  'familyInfo.save': 'Save information',

  'extendYear.title': 'Extend membership period',
  'extendYear.description':
    'The current period is {{from}}–{{to}}. This change applies to all members and does not delete existing data.',
  'extendYear.newLastYear': 'New final year',
  'extendYear.errorMustBeGreater': 'The new year must be greater than {{current}}.',
  'extendYear.toastExtended': 'The membership period has been extended to {{year}}.',
  'extendYear.toastError': 'An error occurred. Please try again.',

  'protectedRoute.loading': 'Loading...',

  'printLayout.cardNumberLabel': 'No.',
}

const de: Dictionary = {
  'common.cancel': 'Abbrechen',
  'common.save': 'Speichern',
  'common.saving': 'Speichern...',
  'common.loading': 'Wird geladen...',

  'login.title': 'Anmeldung',
  'login.subtitle': 'Mitgliederverwaltung — melden Sie sich mit Ihrem Konto an.',
  'login.email': 'E-Mail',
  'login.password': 'Passwort',
  'login.submit': 'Anmelden',
  'login.submitting': 'Anmeldung läuft...',
  'login.error.invalidEmail': 'Ungültige E-Mail-Adresse.',
  'login.error.userDisabled': 'Dieses Konto wurde deaktiviert.',
  'login.error.wrongCredentials': 'Falsche E-Mail-Adresse oder falsches Passwort.',
  'login.error.tooManyRequests':
    'Zu viele Versuche. Bitte versuchen Sie es später erneut.',
  'login.error.generic': 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',

  'dashboard.headerTitle': 'Mitgliederverwaltung',
  'dashboard.logout': 'Abmelden',
  'dashboard.searchPlaceholder': 'Suche nach Name oder Kartennummer...',
  'dashboard.addMember': 'Neues Mitglied hinzufügen',
  'dashboard.periodTitle': 'Mitgliedschaftszeitraum',
  'dashboard.periodDescription':
    'Mitgliedsbeiträge können derzeit von {{from}} bis {{to}} erfasst werden.',
  'dashboard.extendPeriod': 'Zeitraum verlängern',
  'dashboard.mosqueName': 'Name der Moschee',
  'dashboard.yearFrom': 'Von Jahr',
  'dashboard.yearTo': 'Bis Jahr',
  'dashboard.cardsPerPage': 'Karten pro Seite',
  'dashboard.printSelected': 'Ausgewählte drucken ({{count}})',
  'dashboard.colName': 'Name',
  'dashboard.colCardNumber': 'Kartennummer',
  'dashboard.colJoined': 'Beigetreten',
  'dashboard.colStatus': 'Status',
  'dashboard.colPaidYears': 'Bezahlte Jahre',
  'dashboard.colTotalPaid': 'Gesamt bezahlt',
  'dashboard.statusRegular': 'Regulär',
  'dashboard.statusIrregular': 'Nicht regulär',
  'dashboard.noResults': 'Keine Mitglieder gefunden.',
  'dashboard.previousPage': 'Zurück',
  'dashboard.nextPage': 'Weiter',
  'dashboard.pageOf': 'Seite {{page}} von {{total}}',
  'dashboard.summaryAllTime': 'Gesamt bezahlt (alle Jahre)',
  'dashboard.summaryCurrentYear': 'Bezahlt für {{year}}',
  'dashboard.summaryStatus': 'Reguläre / Nicht reguläre Mitglieder',
  'dashboard.footerTotalLabel': 'Gesamt (gefiltert)',
  'dashboard.deleteAria': '{{name}} löschen',
  'dashboard.selectAria': '{{name}} auswählen',
  'dashboard.selectAllAria': 'Alle auswählen',
  'dashboard.toastSelectAtLeastOne':
    'Wählen Sie mindestens ein Mitglied zum Drucken aus.',
  'dashboard.toastInvalidYearRange': 'Der Jahresbereich ist ungültig.',
  'dashboard.toastMemberDeleted': 'Mitglied entfernt.',
  'dashboard.toastDeleteError':
    'Beim Löschen ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
  'dashboard.deleteDialogTitle': 'Mitglied entfernen?',
  'dashboard.deleteDialogDescription':
    '{{name}} wird von der Mitgliederliste entfernt. Die Daten und die Zahlungshistorie werden nicht endgültig gelöscht und können bei Bedarf aus der Datenbank wiederhergestellt werden.',
  'dashboard.deleteConfirm': 'Entfernen',
  'dashboard.deleting': 'Wird gelöscht...',

  'memberForm.editTitle': 'Mitglied bearbeiten',
  'memberForm.addTitle': 'Neues Mitglied hinzufügen',
  'memberForm.description':
    'Mitgliederdaten und die gesamte Beitragstabelle ({{from}}–{{to}}) werden zusammen gespeichert.',
  'memberForm.firstName': 'Vorname',
  'memberForm.lastName': 'Nachname',
  'memberForm.cardNumber': 'Mitgliedskartennummer',
  'memberForm.cardNumberAuto': 'Wird automatisch vergeben',
  'memberForm.joinDate': 'Beitrittsdatum',
  'memberForm.phone': 'Telefon',
  'memberForm.address': 'Adresse',
  'memberForm.isRegularMember': 'Reguläres Mitglied',
  'memberForm.duplicateWarning':
    'Ein Mitglied namens {{name}} existiert bereits. Bearbeiten Sie den vorhandenen Eintrag, anstatt ihn zu duplizieren.',
  'memberForm.editExisting': 'Vorhandenes bearbeiten',
  'memberForm.familyInfoButton': 'Familieninformationen (optional)',
  'memberForm.filled': 'Ausgefüllt',
  'memberForm.paymentsTitle': 'Mitgliedsbeiträge nach Jahr (Betrag in {{currency}})',
  'memberForm.requiredNameError': 'Vor- und Nachname sind erforderlich.',
  'memberForm.toastUpdated': 'Mitgliederdaten wurden aktualisiert.',
  'memberForm.toastCreated': 'Neues Mitglied hinzugefügt.',
  'memberForm.toastSaveError':
    'Beim Speichern ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',

  'familyInfo.title': 'Familieninformationen (optional)',
  'familyInfo.description':
    'Diese Angaben sind optional und können später ergänzt werden.',
  'familyInfo.spouseName': 'Name der Ehefrau',
  'familyInfo.includeSpouseInPrint':
    'Namen der Ehefrau beim Drucken auch auf der Mitgliedskarte anzeigen',
  'familyInfo.memberCount': 'Anzahl der Familienmitglieder',
  'familyInfo.ages': 'Alter der Familienmitglieder',
  'familyInfo.phones': 'Telefonnummern',
  'familyInfo.notes': 'Anmerkung',
  'familyInfo.notesPlaceholder': 'Zusätzliche Anmerkungen...',
  'familyInfo.save': 'Angaben speichern',

  'extendYear.title': 'Mitgliedschaftszeitraum verlängern',
  'extendYear.description':
    'Der aktuelle Zeitraum ist {{from}}–{{to}}. Diese Änderung gilt für alle Mitglieder und löscht keine vorhandenen Daten.',
  'extendYear.newLastYear': 'Neues Endjahr',
  'extendYear.errorMustBeGreater': 'Das neue Jahr muss größer als {{current}} sein.',
  'extendYear.toastExtended':
    'Der Mitgliedschaftszeitraum wurde bis {{year}} verlängert.',
  'extendYear.toastError': 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',

  'protectedRoute.loading': 'Wird geladen...',

  'printLayout.cardNumberLabel': 'Nr.',
}

export const TRANSLATIONS: Record<Locale, Dictionary> = { bs, en, de }

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  let str = TRANSLATIONS[locale][key] ?? TRANSLATIONS[DEFAULT_LOCALE][key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{{${k}}}`, String(v))
    }
  }
  return str
}
