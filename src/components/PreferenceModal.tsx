import { useDispatch } from "react-redux";
import { setCategory, setSource } from "../redux/newSlice";
import { useEffect, useRef, useState } from "react";

const sources = ["news api", "the guardian", "news data hub"];
const categories = [
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

const PreferenceModal = () => {
  const [localSources, setLocalSources] = useState<string[]>([]);
  const [localCategories, setLocalCategories] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getStoredPreferences = (key: string) =>
      localStorage.getItem(key)?.split(",") || [];
    setLocalSources(getStoredPreferences("news-5-sources"));
    setLocalCategories(getStoredPreferences("news-5-categories"));
  }, []);

  const toggleItem = (item: string, setState: Function) => {
    setState((prev: any) =>
      prev.includes(item)
        ? prev.filter((i: any) => i !== item)
        : [...prev, item]
    );
  };

  const handleSave = () => {
    const savePreferences = (key: string, values: string[]) => {
      const valueString = values.join(",");
      localStorage.setItem(key, valueString);
      return valueString;
    };

    dispatch(setSource(savePreferences("news-5-sources", localSources)));
    dispatch(setCategory(savePreferences("news-5-categories", localCategories)));

    setShowAlert(true)

    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.click();
      }
      setShowAlert(false)
    }, 1000);
  };

  const Checkbox = ({
    id,
    label,
    isChecked,
    onChange,
  }: {
    id: string;
    label: string;
    isChecked: boolean;
    onChange: () => void;
  }) => (
    <div className="form-check form-check-inline">
      <input
        className="form-check-input"
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );

  return (
    <div
      className="modal fade"
      id="preferenceModal"
      tabIndex={-1}
      aria-labelledby="preferenceModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="preferenceModalLabel">
              Preferences
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {showAlert && <div className="alert alert-primary" role="alert">
              Preference saved successfully.
            </div>}
            <div className="d-flex flex-column gap-3">
              <div>
                <strong>Select Sources:</strong>
                <div className="d-flex flex-wrap gap-lg-3">
                  {sources.map((source) => (
                    <Checkbox
                      key={source}
                      id={`source-${source}`}
                      label={source}
                      isChecked={localSources.includes(source)}
                      onChange={() =>
                        toggleItem(source, setLocalSources)
                      }
                    />
                  ))}
                </div>
              </div>
              <div>
                <strong>Select Categories:</strong>
                <div className="d-flex flex-wrap gap-lg-3">
                  {categories.map((category) => (
                    <Checkbox
                      key={category}
                      id={`category-${category}`}
                      label={category}
                      isChecked={localCategories.includes(category)}
                      onChange={() =>
                        toggleItem(
                          category,
                          setLocalCategories
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              ref={buttonRef}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferenceModal;
