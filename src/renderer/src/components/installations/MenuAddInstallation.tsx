import { useEffect, useState, useContext } from "react"
import { LanguageContext } from "@contexts/LanguageContext"
import { InstalledGameVersionsContext } from "@contexts/InstalledGameVersionsContext"
import { InstallationsContext } from "@contexts/InstallationsContext"
import { NotificationsContext } from "@contexts/NotificationsContext"
import Button from "@components/Buttons"

function MenuAddInstallation({ setIsMenuOpen }: { setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element {
  const { addNotification } = useContext(NotificationsContext)
  const { installedGameVersions } = useContext(InstalledGameVersionsContext)
  const { installations, setInstallations } = useContext(InstallationsContext)
  const { getKey } = useContext(LanguageContext)
  const [selectedInstalledVersion, setSelectedInstalledVersion] = useState<InstalledGameVersionType>()
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const [installationName, setInstallationName] = useState<string>(``)

  useEffect(() => {
    ;(async (): Promise<void> => {
      const currentUserDataPath = await window.api.getCurrentUserDataPath()
      setSelectedFolder(`${currentUserDataPath}\\VSLInstallations\\${installationName.replace(/[^a-zA-Z0-9-]+/g, "-")}`)
    })()
  }, [installationName])

  useEffect(() => {
    setInstallationName(`Installation ${installations.length + 1}`)
  }, [installations])

  useEffect(() => {
    setSelectedInstalledVersion(installedGameVersions[0])
  }, [installedGameVersions])

  const handleAddInstallation = async (): Promise<void> => {
    try {
      window.api.logMessage("info", `[component] [MenuAddInstallation] Adding installation ${installationName} with path ${selectedFolder}`)

      const newInstallation: InstallationType = {
        name: installationName,
        version: selectedInstalledVersion!.version,
        path: selectedFolder,
        id: Date.now().toString(),
        mods: []
      }

      setInstallations([...installations, newInstallation])
      window.localStorage.setItem("installation", newInstallation.id)

      window.api.logMessage("info", `[component] [MenuAddInstallation] Added installation ${installationName} with path ${selectedFolder}`)
      addNotification(getKey("notification-title-installationSuccesfullyAdded"), getKey("notification-body-installationSuccesfullyAdded").replace("{installation}", installationName), "success")
    } catch (err) {
      window.api.logMessage("error", `[component] [MenuAddInstallation] Error while adding installation ${installationName} with path ${selectedFolder}: ${err}`)
      addNotification(getKey("notification-title-installationErrorAdding"), getKey("notification-body-installationErrorAdding").replace("{installation}", installationName), "error")
    } finally {
      setIsMenuOpen(false)
    }
  }

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">{getKey("component-addInstallationMenu-nameInstallation")}</h3>
          <span className="text-zinc-400">({getKey("component-addInstallationMenu-minMaxCharacters").replace("{min}", "5").replace("{max}", "50")})</span>
        </div>
        <input
          type="text"
          className={`w-full h-10 px-2 flex items-center rounded-md shadow-inner shadow-zinc-950 ${installationName.length < 5 || installationName.length > 50 ? "bg-red-800" : "bg-zinc-900"} select-none overflow-x-scroll whitespace-nowrap`}
          placeholder="Installation name"
          value={installationName}
          onChange={(e) => setInstallationName(e.target.value)}
        />
      </div>

      <div className="w-full max-h-[200px] flex flex-col gap-2">
        <h3 className="font-bold">{getKey("component-addInstallationMenu-selectVersion")}</h3>
        <div className="w-full flex flex-col p-2 gap-2 bg-zinc-900 rounded-md overflow-y-scroll">
          {installedGameVersions.length < 1 ? (
            <div className="w-full h-full flex justify-center items-center">
              <p>{getKey("component-addInstallationMenu-noVersionsFound")}</p>
            </div>
          ) : (
            <>
              {installedGameVersions.map((current) => (
                <button
                  key={current.version}
                  className={`flex justify-between px-2 py-1 font-bold rounded-md shadow-md shadow-zinc-950 disabled:shadow-none disabled:opacity-50  hover:scale-[.99] hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950 ${current.version === selectedInstalledVersion?.version ? "bg-vs text-zinc-900" : "bg-zinc-800"}`}
                  onClick={() => setSelectedInstalledVersion(current)}
                >
                  <span>{current.version}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <h3 className="font-bold">{getKey("component-addInstallationMenu-selectFolder")}</h3>
        <div className="w-full flex gap-4 items-center">
          <Button
            btnType="custom"
            className="w-24 h-10 bg-zinc-900"
            onClick={async () => {
              const userSelectedFolder = await window.api.selectFolderDialog()
              setSelectedFolder(userSelectedFolder)
            }}
          >
            {getKey("component-addInstallationMenu-select")}
          </Button>
          <p className="w-full h-10 px-2 flex items-center rounded-md shadow-inner shadow-zinc-950 bg-zinc-900 select-none overflow-x-scroll whitespace-nowrap">{selectedFolder}</p>
        </div>
      </div>

      {installations.some((ins) => ins.path === selectedFolder) ? <p className="text text-red-600">{getKey("component-addInstallationMenu-folderInUse")}</p> : null}

      <div className="flex flex-col items-center text-center text-sm text-zinc-400">
        <p>{getKey("component-addInstallationMenu-recomendedNewFolder")}</p>
      </div>

      <div className="flex gap-4">
        <Button
          btnType="custom"
          className="w-24 h-10 bg-zinc-900"
          disabled={installationName.length < 5 || installationName.length > 50 || !selectedInstalledVersion || !selectedFolder}
          onClick={() => handleAddInstallation()}
        >
          {getKey("component-addInstallationMenu-add")}
        </Button>
        <Button btnType="custom" className="w-24 h-10 bg-zinc-900" onClick={() => setIsMenuOpen(false)}>
          {getKey("component-addInstallationMenu-close")}
        </Button>
      </div>
    </>
  )
}

export default MenuAddInstallation